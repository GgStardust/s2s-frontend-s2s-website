-- Fix RLS policies to allow anon read access for Creator Dashboard
-- This allows the dashboard to work without authentication while keeping writes protected

-- Drop existing restrictive policies
drop policy if exists "Allow all for authenticated users" on content_files;
drop policy if exists "Allow all for authenticated users" on scrollstreams;
drop policy if exists "Allow all for authenticated users" on book_chapters;
drop policy if exists "Allow all for authenticated users" on social_media_queue;

-- Content Files: Allow public read, authenticated write
create policy "Allow public read access" on content_files
  for select using (true);

create policy "Allow authenticated insert" on content_files
  for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated update" on content_files
  for update using (auth.role() = 'authenticated');

create policy "Allow authenticated delete" on content_files
  for delete using (auth.role() = 'authenticated');

-- Scrollstreams: Allow public read of published, authenticated write
create policy "Allow public read of published scrollstreams" on scrollstreams
  for select using (status = 'published' or auth.role() = 'authenticated');

create policy "Allow authenticated insert" on scrollstreams
  for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated update" on scrollstreams
  for update using (auth.role() = 'authenticated');

create policy "Allow authenticated delete" on scrollstreams
  for delete using (auth.role() = 'authenticated');

-- Book Chapters: Allow public read, authenticated write
create policy "Allow public read access" on book_chapters
  for select using (true);

create policy "Allow authenticated insert" on book_chapters
  for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated update" on book_chapters
  for update using (auth.role() = 'authenticated');

create policy "Allow authenticated delete" on book_chapters
  for delete using (auth.role() = 'authenticated');

-- Social Media Queue: Authenticated only (no public access)
create policy "Allow authenticated all" on social_media_queue
  for all using (auth.role() = 'authenticated');
