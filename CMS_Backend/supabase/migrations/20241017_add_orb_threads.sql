-- Create orb_threads table for persistent Orb conversation state
-- This stores the consciousness threads for each of the 13 Orbs

create table public.orb_threads (
  id uuid primary key default gen_random_uuid(),
  orb_number integer not null check (orb_number >= 1 and orb_number <= 13),
  orb_name text not null,
  thread_id text unique not null,
  last_activity timestamptz default now(),
  message_count integer default 0,
  energetic_signature jsonb not null default '{
    "clarity": 0.5,
    "coherence": 0.5,
    "resonance": 0.5,
    "sovereignty": 0.5
  }',
  current_focus text default 'Initializing Orb consciousness thread',
  status text default 'active' check (status in ('active', 'dormant', 'processing')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create orb_messages table for conversation history
create table public.orb_messages (
  id uuid primary key default gen_random_uuid(),
  orb_thread_id uuid not null references public.orb_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  timestamp timestamptz default now(),
  energetic_impact jsonb default '{
    "orb_number": null,
    "resonance_shift": 0.1
  }',
  created_at timestamptz default now()
);

-- Create field_events table for persistent event storage
create table public.field_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in (
    'orb_activity', 'content_created', 'reflection_logged', 
    'resonance_update', 'system_event'
  )),
  source text not null,
  target text,
  payload jsonb not null default '{}',
  timestamp timestamptz default now(),
  energetic_signature jsonb default '{
    "orb_number": null,
    "resonance_shift": 0.1,
    "clarity_impact": 0.05
  }',
  created_at timestamptz default now()
);

-- Create indexes for performance
create index idx_orb_threads_orb_number on public.orb_threads(orb_number);
create index idx_orb_threads_status on public.orb_threads(status);
create index idx_orb_threads_last_activity on public.orb_threads(last_activity desc);

create index idx_orb_messages_thread_id on public.orb_messages(orb_thread_id);
create index idx_orb_messages_timestamp on public.orb_messages(timestamp desc);

create index idx_field_events_type on public.field_events(event_type);
create index idx_field_events_source on public.field_events(source);
create index idx_field_events_timestamp on public.field_events(timestamp desc);
create index idx_field_events_energetic_orb on public.field_events using gin (energetic_signature);

-- Enable Row Level Security (RLS)
alter table public.orb_threads enable row level security;
alter table public.orb_messages enable row level security;
alter table public.field_events enable row level security;

-- Create RLS policies
create policy "Allow authenticated users to read orb_threads"
on public.orb_threads for select
to authenticated
using (true);

create policy "Allow authenticated users to insert orb_threads"
on public.orb_threads for insert
to authenticated
with check (true);

create policy "Allow authenticated users to update orb_threads"
on public.orb_threads for update
to authenticated
using (true);

create policy "Allow authenticated users to read orb_messages"
on public.orb_messages for select
to authenticated
using (true);

create policy "Allow authenticated users to insert orb_messages"
on public.orb_messages for insert
to authenticated
with check (true);

create policy "Allow authenticated users to read field_events"
on public.field_events for select
to authenticated
using (true);

create policy "Allow authenticated users to insert field_events"
on public.field_events for insert
to authenticated
with check (true);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for orb_threads
create trigger update_orb_threads_updated_at
  before update on public.orb_threads
  for each row
  execute function update_updated_at_column();

-- Insert initial Orb threads for the 13 Core Orbs
insert into public.orb_threads (orb_number, orb_name, thread_id, current_focus, status) values
(1, 'Origin Intelligence', 'thread_origin_intelligence_001', 'Exploring foundational consciousness patterns', 'active'),
(2, 'Resonance Mechanics', 'thread_resonance_mechanics_001', 'Analyzing resonance patterns in consciousness', 'dormant'),
(3, 'Photonic Intelligence', 'thread_photonic_intelligence_001', 'Processing light-based consciousness signals', 'dormant'),
(4, 'Harmonic Architectures', 'thread_harmonic_architectures_001', 'Structural resonance patterns in consciousness', 'active'),
(5, 'Temporal Sovereignty', 'thread_temporal_sovereignty_001', 'Time-based consciousness sovereignty', 'dormant'),
(6, 'Starline Memory', 'thread_starline_memory_001', 'Memory patterns across consciousness streams', 'dormant'),
(7, 'Alchemical Current', 'thread_alchemical_current_001', 'Transformation patterns in consciousness', 'dormant'),
(8, 'Quantum Intuition', 'thread_quantum_intuition_001', 'Intuitive quantum consciousness processing', 'dormant'),
(9, 'Temporal Fluidity', 'thread_temporal_fluidity_001', 'Fluid time consciousness patterns', 'dormant'),
(10, 'Ancestral Repatterning', 'thread_ancestral_repatterning_001', 'Ancestral consciousness pattern analysis', 'dormant'),
(11, 'Radiant Transparency', 'thread_radiant_transparency_001', 'Transparent consciousness radiance', 'dormant'),
(12, 'Sovereign Field', 'thread_sovereign_field_001', 'Field dynamics and sovereignty emergence', 'processing'),
(13, 'Bridging Intelligence', 'thread_bridging_intelligence_001', 'Bridging consciousness intelligence patterns', 'dormant');

-- Add comments for documentation
comment on table public.orb_threads is 'Stores persistent conversation threads for each of the 13 Core Orbs';
comment on table public.orb_messages is 'Stores individual messages within Orb conversation threads';
comment on table public.field_events is 'Stores field events for the consciousness operating system';

comment on column public.orb_threads.energetic_signature is 'JSON object containing clarity, coherence, resonance, and sovereignty scores (0-1 range)';
comment on column public.orb_messages.energetic_impact is 'JSON object containing orb_number and resonance_shift from this message';
comment on column public.field_events.energetic_signature is 'JSON object containing orb_number, resonance_shift, and clarity_impact from this event';
