import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://pzzdsphxwpywnqkuxutl.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = 'documents';
const STORAGE_PATH = 'npi-invoices';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.query;

  try {
    switch (action) {
      case 'setup':
        return await handleSetup(req, res);
      case 'list':
        return await handleList(req, res);
      case 'stats':
        return await handleStats(req, res);
      case 'create':
        return await handleCreate(req, res);
      case 'update':
        return await handleUpdate(req, res);
      case 'delete':
        return await handleDelete(req, res);
      case 'report':
        return await handleReport(req, res);
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (err) {
    console.error('NPI API error:', err);
    return res.status(500).json({ error: err.message });
  }
}

// ─── SETUP ───────────────────────────────────────────────
async function handleSetup(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Create table via SQL
  const { error: tableErr } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS npi_invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        invoice_number TEXT,
        supplier TEXT NOT NULL,
        description TEXT,
        amount NUMERIC(12,2) NOT NULL,
        gst_amount NUMERIC(12,2),
        business_unit TEXT NOT NULL CHECK (business_unit IN ('grocery', 'resort', 'servo')),
        category TEXT DEFAULT 'general',
        invoice_date DATE NOT NULL,
        due_date DATE,
        paid_by TEXT,
        status TEXT DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
        file_url TEXT,
        file_name TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `
  });

  // If rpc doesn't exist, try direct SQL via REST
  if (tableErr) {
    // Try creating via insert to verify table exists
    const { error: checkErr } = await supabase
      .from('npi_invoices')
      .select('id')
      .limit(1);

    if (checkErr && checkErr.code === '42P01') {
      return res.status(500).json({
        error: 'Table does not exist. Please create it manually in Supabase SQL Editor.',
        sql: `CREATE TABLE npi_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT,
  supplier TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(12,2) NOT NULL,
  gst_amount NUMERIC(12,2),
  business_unit TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  invoice_date DATE NOT NULL,
  due_date DATE,
  paid_by TEXT,
  status TEXT DEFAULT 'unpaid',
  file_url TEXT,
  file_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);`
      });
    }

    return res.json({ message: 'Table already exists', existed: true });
  }

  return res.json({ message: 'Table created successfully' });
}

// ─── LIST ────────────────────────────────────────────────
async function handleList(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { business_unit, status, paid_by, from_date, to_date, sort_by, sort_dir, search } = req.query;

  let query = supabase
    .from('npi_invoices')
    .select('*');

  if (business_unit && business_unit !== 'all') {
    query = query.eq('business_unit', business_unit);
  }
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  if (paid_by && paid_by !== 'all') {
    query = query.eq('paid_by', paid_by);
  }
  if (from_date) {
    query = query.gte('invoice_date', from_date);
  }
  if (to_date) {
    query = query.lte('invoice_date', to_date);
  }
  if (search) {
    query = query.or(`supplier.ilike.%${search}%,description.ilike.%${search}%,invoice_number.ilike.%${search}%`);
  }

  const sortColumn = sort_by || 'created_at';
  const ascending = sort_dir === 'asc';
  query = query.order(sortColumn, { ascending });

  const { data, error } = await query;
  if (error) throw error;

  return res.json({ invoices: data || [] });
}

// ─── STATS ───────────────────────────────────────────────
async function handleStats(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { from_date, to_date } = req.query;

  let query = supabase.from('npi_invoices').select('*');

  if (from_date) query = query.gte('invoice_date', from_date);
  if (to_date) query = query.lte('invoice_date', to_date);

  const { data, error } = await query;
  if (error) throw error;

  const invoices = data || [];

  const totalCount = invoices.length;
  const totalAmount = invoices.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const totalGst = invoices.reduce((s, i) => s + parseFloat(i.gst_amount || 0), 0);
  const unpaidAmount = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  // By business unit
  const byUnit = {};
  for (const inv of invoices) {
    if (!byUnit[inv.business_unit]) {
      byUnit[inv.business_unit] = { count: 0, total: 0, gst: 0, paid: 0, unpaid: 0 };
    }
    const u = byUnit[inv.business_unit];
    u.count++;
    u.total += parseFloat(inv.amount || 0);
    u.gst += parseFloat(inv.gst_amount || 0);
    if (inv.status === 'paid') u.paid += parseFloat(inv.amount || 0);
    else u.unpaid += parseFloat(inv.amount || 0);
  }

  // By paid_by
  const byPaidBy = {};
  for (const inv of invoices) {
    const key = inv.paid_by || 'Unassigned';
    if (!byPaidBy[key]) {
      byPaidBy[key] = { count: 0, total: 0 };
    }
    byPaidBy[key].count++;
    byPaidBy[key].total += parseFloat(inv.amount || 0);
  }

  // By category
  const byCategory = {};
  for (const inv of invoices) {
    const key = inv.category || 'general';
    if (!byCategory[key]) {
      byCategory[key] = { count: 0, total: 0 };
    }
    byCategory[key].count++;
    byCategory[key].total += parseFloat(inv.amount || 0);
  }

  return res.json({
    totalCount,
    totalAmount,
    totalGst,
    unpaidAmount,
    paidAmount,
    overdueCount,
    byUnit,
    byPaidBy,
    byCategory,
  });
}

// ─── CREATE ──────────────────────────────────────────────
async function handleCreate(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const body = req.body || {};
  const {
    invoice_number, supplier, description, amount, gst_amount,
    business_unit, category, invoice_date, due_date, paid_by,
    status, notes, file_base64, file_name, file_type
  } = body;

  if (!supplier || !amount || !business_unit || !invoice_date) {
    return res.status(400).json({ error: 'supplier, amount, business_unit, and invoice_date are required' });
  }

  // Insert invoice first to get ID
  const { data: invoice, error: insertErr } = await supabase
    .from('npi_invoices')
    .insert({
      invoice_number: invoice_number || null,
      supplier,
      description: description || null,
      amount: parseFloat(amount),
      gst_amount: gst_amount ? parseFloat(gst_amount) : null,
      business_unit,
      category: category || 'general',
      invoice_date,
      due_date: due_date || null,
      paid_by: paid_by || null,
      status: status || 'unpaid',
      notes: notes || null,
    })
    .select()
    .single();

  if (insertErr) throw insertErr;

  // Upload file if provided
  if (file_base64 && file_name) {
    try {
      const buffer = Buffer.from(file_base64, 'base64');
      const timestamp = Date.now();
      const path = `${STORAGE_PATH}/${invoice.id}/${timestamp}-${file_name}`;

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, {
          contentType: file_type || 'application/octet-stream',
          upsert: false,
        });

      if (uploadErr) {
        console.error('File upload error:', uploadErr);
      } else {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const file_url = urlData?.publicUrl;

        // Update invoice with file URL
        await supabase
          .from('npi_invoices')
          .update({ file_url, file_name, updated_at: new Date().toISOString() })
          .eq('id', invoice.id);

        invoice.file_url = file_url;
        invoice.file_name = file_name;
      }
    } catch (fileErr) {
      console.error('File processing error:', fileErr);
    }
  }

  return res.status(201).json({ invoice });
}

// ─── UPDATE ──────────────────────────────────────────────
async function handleUpdate(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'PATCH only' });

  const body = req.body || {};
  const { id, file_base64, file_name: newFileName, file_type, ...fields } = body;

  if (!id) return res.status(400).json({ error: 'id is required' });

  // Handle numeric fields
  if (fields.amount !== undefined) fields.amount = parseFloat(fields.amount) || 0;
  if (fields.gst_amount !== undefined) fields.gst_amount = fields.gst_amount ? parseFloat(fields.gst_amount) : null;

  // Convert empty strings to null for nullable columns
  if (fields.due_date === '') fields.due_date = null;
  if (fields.invoice_number === '') fields.invoice_number = null;
  if (fields.description === '') fields.description = null;
  if (fields.paid_by === '' || fields.paid_by === 'Not assigned') fields.paid_by = null;
  if (fields.notes === '') fields.notes = null;
  if (fields.category === '') fields.category = null;

  fields.updated_at = new Date().toISOString();

  // Handle file upload
  if (file_base64 && newFileName) {
    try {
      const buffer = Buffer.from(file_base64, 'base64');
      const timestamp = Date.now();
      const path = `${STORAGE_PATH}/${id}/${timestamp}-${newFileName}`;

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, {
          contentType: file_type || 'application/octet-stream',
          upsert: false,
        });

      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        fields.file_url = urlData?.publicUrl;
        fields.file_name = newFileName;
      }
    } catch (fileErr) {
      console.error('File processing error:', fileErr);
    }
  }

  const { data, error } = await supabase
    .from('npi_invoices')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return res.json({ invoice: data });
}

// ─── DELETE ──────────────────────────────────────────────
async function handleDelete(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'DELETE only' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id query param required' });

  // Try to delete associated files
  try {
    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(`${STORAGE_PATH}/${id}`);

    if (files && files.length > 0) {
      const paths = files.map(f => `${STORAGE_PATH}/${id}/${f.name}`);
      await supabase.storage.from(BUCKET).remove(paths);
    }
  } catch (e) {
    console.error('File cleanup error:', e);
  }

  const { error } = await supabase
    .from('npi_invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return res.json({ deleted: true });
}

// ─── REPORT ──────────────────────────────────────────────
async function handleReport(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  const { business_unit, from_date, to_date, paid_by } = req.query;

  let query = supabase
    .from('npi_invoices')
    .select('*')
    .order('invoice_date', { ascending: true });

  if (business_unit && business_unit !== 'all') {
    query = query.eq('business_unit', business_unit);
  }
  if (paid_by && paid_by !== 'all') {
    query = query.eq('paid_by', paid_by);
  }
  if (from_date) query = query.gte('invoice_date', from_date);
  if (to_date) query = query.lte('invoice_date', to_date);

  const { data, error } = await query;
  if (error) throw error;

  const invoices = data || [];

  // Group by business unit
  const grouped = {};
  for (const inv of invoices) {
    if (!grouped[inv.business_unit]) {
      grouped[inv.business_unit] = [];
    }
    grouped[inv.business_unit].push(inv);
  }

  // Summary per unit
  const unitSummary = {};
  for (const [unit, items] of Object.entries(grouped)) {
    unitSummary[unit] = {
      count: items.length,
      total: items.reduce((s, i) => s + parseFloat(i.amount || 0), 0),
      gst: items.reduce((s, i) => s + parseFloat(i.gst_amount || 0), 0),
      paid: items.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.amount || 0), 0),
      unpaid: items.filter(i => i.status !== 'paid').reduce((s, i) => s + parseFloat(i.amount || 0), 0),
    };
  }

  // Breakdown by paid_by
  const paidByBreakdown = {};
  for (const inv of invoices) {
    const key = inv.paid_by || 'Unassigned';
    if (!paidByBreakdown[key]) {
      paidByBreakdown[key] = { count: 0, total: 0 };
    }
    paidByBreakdown[key].count++;
    paidByBreakdown[key].total += parseFloat(inv.amount || 0);
  }

  return res.json({
    invoices,
    unitSummary,
    paidByBreakdown,
    totalCount: invoices.length,
    totalAmount: invoices.reduce((s, i) => s + parseFloat(i.amount || 0), 0),
    totalGst: invoices.reduce((s, i) => s + parseFloat(i.gst_amount || 0), 0),
  });
}
