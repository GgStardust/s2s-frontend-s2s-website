-- Add schedule_date column to scrollstreams table for scheduling functionality

ALTER TABLE scrollstreams
ADD COLUMN IF NOT EXISTS schedule_date TIMESTAMP WITH TIME ZONE;

-- Add index for querying scheduled scrollstreams
CREATE INDEX IF NOT EXISTS idx_scrollstreams_schedule_date
ON scrollstreams(schedule_date)
WHERE schedule_date IS NOT NULL;

-- Add comment
COMMENT ON COLUMN scrollstreams.schedule_date IS 'When this scrollstream should be published (null = publish immediately)';
