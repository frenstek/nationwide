CREATE TABLE IF NOT EXISTS inclusions_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config JSONB NOT NULL,
  updated_by TEXT DEFAULT 'unknown',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE inclusions_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read inclusions_configs" ON inclusions_configs FOR SELECT USING (true);
CREATE POLICY "Service role manage inclusions_configs" ON inclusions_configs FOR ALL USING (true) WITH CHECK (true);
