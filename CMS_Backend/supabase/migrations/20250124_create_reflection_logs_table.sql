-- Create reflection_logs table for Field Console
CREATE TABLE IF NOT EXISTS reflection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID, -- For multi-tenancy
  artifact_id TEXT NOT NULL,
  summary_one_sentence TEXT NOT NULL,
  clarity_score DECIMAL(3,2) NOT NULL CHECK (clarity_score >= 0 AND clarity_score <= 1),
  coherence_score DECIMAL(3,2) NOT NULL CHECK (coherence_score >= 0 AND coherence_score <= 1),
  consequence_score DECIMAL(3,2) NOT NULL CHECK (consequence_score >= 0 AND consequence_score <= 1),
  notes TEXT,
  reviewed_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reflection_logs_tenant_id ON reflection_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reflection_logs_artifact_id ON reflection_logs(artifact_id);
CREATE INDEX IF NOT EXISTS idx_reflection_logs_created_at ON reflection_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflection_logs_reviewed_by ON reflection_logs(reviewed_by);

-- Add RLS policies
ALTER TABLE reflection_logs ENABLE ROW LEVEL SECURITY;

-- Policy for public access to reflection logs (for now, can be restricted later)
DROP POLICY IF EXISTS "Reflection logs are viewable by everyone." ON reflection_logs;
CREATE POLICY "Reflection logs are viewable by everyone."
ON reflection_logs FOR SELECT
USING (true);

-- Policy for creators to manage their own reflection logs
DROP POLICY IF EXISTS "Users can manage their own reflection logs." ON reflection_logs;
CREATE POLICY "Users can manage their own reflection logs."
ON reflection_logs FOR ALL
USING (auth.uid() IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()))
WITH CHECK (auth.uid() IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM user_roles WHERE user_id = auth.uid()));

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_reflection_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_reflection_logs_updated_at ON reflection_logs;
CREATE TRIGGER trigger_update_reflection_logs_updated_at
  BEFORE UPDATE ON reflection_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_reflection_logs_updated_at();





