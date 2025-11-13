-- Add energetic_profile field to content_files table
-- This stores computed energetic signatures for each piece of content

-- Add energetic_profile column to content_files table
alter table public.content_files 
add column if not exists energetic_profile jsonb;

-- Add index for energetic_profile queries
create index if not exists idx_content_files_energetic_profile 
on public.content_files using gin (energetic_profile);

-- Add comment explaining the energetic_profile structure
comment on column public.content_files.energetic_profile is 
'Computed energetic signature containing clarity, coherence, resonance, and sovereignty scores (0-1 range)';

-- Example energetic_profile structure:
-- {
--   "clarity": 0.85,
--   "coherence": 0.92, 
--   "resonance": 0.78,
--   "sovereignty": 0.88,
--   "computed_at": "2024-10-16T12:00:00Z",
--   "computed_by": "resonance_engine_v1"
-- }



