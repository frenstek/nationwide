CREATE TABLE IF NOT EXISTS estimator_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config JSONB NOT NULL,
  updated_by TEXT DEFAULT 'unknown',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE estimator_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read estimator_configs" ON estimator_configs FOR SELECT USING (true);
CREATE POLICY "Service role manage estimator_configs" ON estimator_configs FOR ALL USING (true) WITH CHECK (true);

auto