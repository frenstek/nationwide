-- NPI Invoices Table
-- Run this in Supabase SQL Editor to create the table

CREATE TABLE IF NOT EXISTS npi_invoices (
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
);

-- Enable RLS but allow service_role full access
ALTER TABLE npi_invoices ENABLE ROW LEVEL SECURITY;

-- Allow service_role (API) full access
CREATE POLICY "service_role_all" ON npi_invoices
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_npi_invoices_business_unit ON npi_invoices (business_unit);
CREATE INDEX IF NOT EXISTS idx_npi_invoices_status ON npi_invoices (status);
CREATE INDEX IF NOT EXISTS idx_npi_invoices_invoice_date ON npi_invoices (invoice_date);
CREATE INDEX IF NOT EXISTS idx_npi_invoices_paid_by ON npi_invoices (paid_by);
