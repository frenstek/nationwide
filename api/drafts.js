import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const action = req.query.action || '';

    // GET — list all drafts
    if (req.method === 'GET' && action === 'list') {
      const { data, error } = await supabase
        .from('estimator_drafts')
        .select('id, client_name, site_address, status, current_step, last_category, created_at, updated_at')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    }

    // GET — load single draft
    if (req.method === 'GET' && action === 'get') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id required' });
      const { data, error } = await supabase
        .from('estimator_drafts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return res.json(data);
    }

    // POST — create new draft
    if (req.method === 'POST' && action === 'create') {
      const { client_name, site_address, form_data, completed_steps, current_step, last_category } = req.body || {};
      const { data, error } = await supabase
        .from('estimator_drafts')
        .insert({
          client_name: client_name || 'Untitled Quote',
          site_address: site_address || '',
          form_data: form_data || {},
          completed_steps: completed_steps || [],
          current_step: current_step || 0,
          last_category: last_category || '',
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    // PATCH — update draft
    if (req.method === 'PATCH') {
      const { id, ...updates } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      updates.updated_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('estimator_drafts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }

    // DELETE — delete draft
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      const { error } = await supabase
        .from('estimator_drafts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return res.json({ success: true });
    }

    // POST — setup table (one-time)
    if (req.method === 'POST' && action === 'setup') {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS estimator_drafts (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            client_name TEXT,
            site_address TEXT,
            form_data JSONB NOT NULL DEFAULT '{}',
            completed_steps JSONB NOT NULL DEFAULT '[]',
            current_step INT DEFAULT 0,
            status TEXT DEFAULT 'draft',
            last_category TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      // rpc might not exist — try direct insert to test
      if (error) {
        return res.json({ setup: 'rpc_failed', error: error.message, note: 'Run migration SQL manually or table may already exist' });
      }
      return res.json({ setup: 'ok' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
