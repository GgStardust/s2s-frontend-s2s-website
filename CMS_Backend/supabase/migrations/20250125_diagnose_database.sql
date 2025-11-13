-- DIAGNOSTIC SCRIPT - DO NOT RUN IN PRODUCTION
-- Purpose: Understand what's actually in the content_files table

-- Check what columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'content_files'
ORDER BY ordinal_position;

-- Check what data exists
SELECT id, title, content_type, status, created_at
FROM content_files
LIMIT 10;

-- Check what content_type values exist
SELECT DISTINCT content_type, COUNT(*) as count
FROM content_files
GROUP BY content_type;

-- Check what status values exist  
SELECT DISTINCT status, COUNT(*) as count
FROM content_files
GROUP BY status;
