-- Add Reflection Logs table for Reality-Check Protocol
-- This table stores reflection entries for the Sovereign System Architecture

CREATE TABLE IF NOT EXISTS reflection_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artifact_id TEXT NOT NULL,
  summary_one_sentence TEXT NOT NULL,
  clarity_score DECIMAL(3,2) NOT NULL CHECK (clarity_score >= 0 AND clarity_score <= 1),
  coherence_score DECIMAL(3,2) NOT NULL CHECK (coherence_score >= 0 AND coherence_score <= 1),
  consequence_score DECIMAL(3,2) NOT NULL CHECK (consequence_score >= 0 AND consequence_score <= 1),
  notes TEXT,
  reviewed_by TEXT NOT NULL DEFAULT 'Gigi Stardust',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reflection_logs_artifact_id ON reflection_logs(artifact_id);
CREATE INDEX IF NOT EXISTS idx_reflection_logs_created_at ON reflection_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflection_logs_reviewed_by ON reflection_logs(reviewed_by);

-- Add RLS (Row Level Security) policies
ALTER TABLE reflection_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all reflection logs
CREATE POLICY "Allow authenticated users to read reflection logs" ON reflection_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert reflection logs
CREATE POLICY "Allow authenticated users to insert reflection logs" ON reflection_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own reflection logs
CREATE POLICY "Allow authenticated users to update reflection logs" ON reflection_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reflection_logs_updated_at 
  BEFORE UPDATE ON reflection_logs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE reflection_logs IS 'Stores reflection entries for the Reality-Check Protocol in the Sovereign System Architecture';
COMMENT ON COLUMN reflection_logs.artifact_id IS 'Identifier for the artifact being reflected upon (content file ID, task ID, etc.)';
COMMENT ON COLUMN reflection_logs.summary_one_sentence IS 'One-sentence summary of the artifact as per Reality-Check Protocol';
COMMENT ON COLUMN reflection_logs.clarity_score IS 'Clarity score from 0-1 as per Reality-Check Protocol Phase 1';
COMMENT ON COLUMN reflection_logs.coherence_score IS 'Coherence score from 0-1 as per Reality-Check Protocol Phase 2';
COMMENT ON COLUMN reflection_logs.consequence_score IS 'Consequence score from 0-1 as per Reality-Check Protocol Phase 3';
COMMENT ON COLUMN reflection_logs.notes IS 'Additional observations or context for the reflection';
COMMENT ON COLUMN reflection_logs.reviewed_by IS 'Name of the person who conducted the reflection';



