-- BOOK COMPILER V2: MATHEMATICAL LAYER SUPPORT
-- Purpose: Add mathematical resonance layer support to content_files and create proof logging system

-- Step 1: Add mathematical layer columns to content_files table
ALTER TABLE content_files 
ADD COLUMN IF NOT EXISTS resonance_vector JSONB,
ADD COLUMN IF NOT EXISTS coherence_matrix JSONB,
ADD COLUMN IF NOT EXISTS field_dynamics JSONB,
ADD COLUMN IF NOT EXISTS sovereign_proof JSONB,
ADD COLUMN IF NOT EXISTS mathematical_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS proof_log_id UUID;

-- Step 2: Create proof_logs table for mathematical validation
CREATE TABLE IF NOT EXISTS proof_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content_files(id),
    proof_type VARCHAR(50) NOT NULL,
    proof_data JSONB NOT NULL,
    coherence_score DECIMAL(3,2),
    sovereignty_score DECIMAL(3,2),
    validity_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Step 3: Create resonance_fields table for book-level resonance tracking
CREATE TABLE IF NOT EXISTS resonance_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id),
    field_strength DECIMAL(5,3),
    field_coherence DECIMAL(5,3),
    field_stability DECIMAL(5,3),
    orb_activations JSONB,
    calculated_at TIMESTAMP DEFAULT NOW()
);

-- Step 4: Create orbital_context table for caching Orbital Brain analysis
CREATE TABLE IF NOT EXISTS orbital_context (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_hash VARCHAR(64) UNIQUE,
    orb_associations JSONB,
    undercurrent_links JSONB,
    resonance_metrics JSONB,
    cached_at TIMESTAMP DEFAULT NOW()
);

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_files_resonance_vector ON content_files USING GIN (resonance_vector);
CREATE INDEX IF NOT EXISTS idx_content_files_coherence_matrix ON content_files USING GIN (coherence_matrix);
CREATE INDEX IF NOT EXISTS idx_content_files_field_dynamics ON content_files USING GIN (field_dynamics);
CREATE INDEX IF NOT EXISTS idx_content_files_sovereign_proof ON content_files USING GIN (sovereign_proof);
CREATE INDEX IF NOT EXISTS idx_content_files_mathematical_score ON content_files(mathematical_score);
CREATE INDEX IF NOT EXISTS idx_content_files_proof_log_id ON content_files(proof_log_id);

CREATE INDEX IF NOT EXISTS idx_proof_logs_content_id ON proof_logs (content_id);
CREATE INDEX IF NOT EXISTS idx_proof_logs_proof_type ON proof_logs (proof_type);
CREATE INDEX IF NOT EXISTS idx_proof_logs_validity_status ON proof_logs (validity_status);
CREATE INDEX IF NOT EXISTS idx_proof_logs_created_at ON proof_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_resonance_fields_book_id ON resonance_fields (book_id);
CREATE INDEX IF NOT EXISTS idx_resonance_fields_calculated_at ON resonance_fields (calculated_at DESC);

CREATE INDEX IF NOT EXISTS idx_orbital_context_content_hash ON orbital_context (content_hash);
CREATE INDEX IF NOT EXISTS idx_orbital_context_cached_at ON orbital_context (cached_at DESC);

-- Step 6: Add foreign key constraint for proof_log_id
ALTER TABLE content_files 
ADD CONSTRAINT fk_content_files_proof_log_id 
FOREIGN KEY (proof_log_id) REFERENCES proof_logs(id);

-- Step 7: Enable RLS on new tables
ALTER TABLE proof_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resonance_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE orbital_context ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies for proof_logs
DROP POLICY IF EXISTS "Proof logs are viewable by everyone." ON proof_logs;
CREATE POLICY "Proof logs are viewable by everyone."
ON proof_logs FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can manage proof logs." ON proof_logs;
CREATE POLICY "Users can manage proof logs."
ON proof_logs FOR ALL
USING (auth.uid() IS NOT NULL);

-- Step 9: Create RLS policies for resonance_fields
DROP POLICY IF EXISTS "Resonance fields are viewable by everyone." ON resonance_fields;
CREATE POLICY "Resonance fields are viewable by everyone."
ON resonance_fields FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can manage resonance fields." ON resonance_fields;
CREATE POLICY "Users can manage resonance fields."
ON resonance_fields FOR ALL
USING (auth.uid() IS NOT NULL);

-- Step 10: Create RLS policies for orbital_context
DROP POLICY IF EXISTS "Orbital context is viewable by everyone." ON orbital_context;
CREATE POLICY "Orbital context is viewable by everyone."
ON orbital_context FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can manage orbital context." ON orbital_context;
CREATE POLICY "Users can manage orbital context."
ON orbital_context FOR ALL
USING (auth.uid() IS NOT NULL);

-- Step 11: Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_proof_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = COALESCE(NEW.created_at, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_proof_logs_updated_at ON proof_logs;
CREATE TRIGGER trigger_update_proof_logs_updated_at
  BEFORE INSERT ON proof_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_proof_logs_updated_at();

-- Step 12: Insert sample proof log for testing
INSERT INTO proof_logs (content_id, proof_type, proof_data, coherence_score, sovereignty_score, validity_status)
SELECT 
    cf.id,
    'content_analysis',
    '{"resonance_vector": {"x": 0.8, "y": 0.7, "z": 0.9, "w": 0.6}, "coherence_matrix": {"orb_1": 0.8, "orb_2": 0.7}, "field_dynamics": {"strength": 0.75, "stability": 0.8}}',
    0.75,
    0.8,
    'proven'
FROM content_files cf
WHERE cf.title = 'Cosmic, Biological & Consciousness Dimensions'
AND NOT EXISTS (
    SELECT 1 FROM proof_logs pl WHERE pl.content_id = cf.id
);

-- Step 13: Update content_files with sample mathematical data
UPDATE content_files 
SET 
    resonance_vector = '{"x": 0.8, "y": 0.7, "z": 0.9, "w": 0.6}',
    coherence_matrix = '{"orb_1": 0.8, "orb_2": 0.7, "orb_3": 0.6}',
    field_dynamics = '{"strength": 0.75, "stability": 0.8, "coherence": 0.7}',
    sovereign_proof = '{"validity": "proven", "coherence": 0.75, "sovereignty": 0.8}',
    mathematical_score = 0.75,
    proof_log_id = (
        SELECT id FROM proof_logs 
        WHERE content_id = content_files.id 
        LIMIT 1
    )
WHERE title = 'Cosmic, Biological & Consciousness Dimensions';

-- Step 14: Verify the schema updates
SELECT 
    'Mathematical layer schema verification:' as info,
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('content_files', 'proof_logs', 'resonance_fields', 'orbital_context')
AND column_name IN ('resonance_vector', 'coherence_matrix', 'field_dynamics', 'sovereign_proof', 'mathematical_score', 'proof_log_id', 'proof_type', 'proof_data', 'field_strength', 'content_hash', 'orb_associations')
ORDER BY table_name, column_name;

