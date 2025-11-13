-- Real-time Infrastructure Database Schema
-- Sprint 2: Real-time Infrastructure Implementation

-- Create collaboration_events table for tracking real-time collaboration
CREATE TABLE IF NOT EXISTS collaboration_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  user_name TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('join', 'leave', 'edit', 'cursor_move', 'selection_change')),
  data JSONB,
  tenant_id UUID,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_collaboration_events_session_id ON collaboration_events(session_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_events_user_id ON collaboration_events(user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_events_tenant_id ON collaboration_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_events_timestamp ON collaboration_events(timestamp);

-- Create realtime_connections table for tracking active connections
CREATE TABLE IF NOT EXISTS realtime_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  socket_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disconnected'))
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_realtime_connections_user_id ON realtime_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_realtime_connections_tenant_id ON realtime_connections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_realtime_connections_status ON realtime_connections(status);

-- Create realtime_notifications table for system notifications
CREATE TABLE IF NOT EXISTS realtime_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'resonance', 'collaboration')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_tenant_id ON realtime_notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_user_id ON realtime_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_type ON realtime_notifications(type);
CREATE INDEX IF NOT EXISTS idx_realtime_notifications_created_at ON realtime_notifications(created_at);

-- Create realtime_rooms table for managing collaboration rooms
CREATE TABLE IF NOT EXISTS realtime_rooms (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('content', 'book', 'orb', 'collaboration')),
  tenant_id UUID NOT NULL,
  content_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  participant_count INTEGER DEFAULT 0
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_realtime_rooms_tenant_id ON realtime_rooms(tenant_id);
CREATE INDEX IF NOT EXISTS idx_realtime_rooms_type ON realtime_rooms(type);
CREATE INDEX IF NOT EXISTS idx_realtime_rooms_content_id ON realtime_rooms(content_id);

-- Create realtime_room_participants table for tracking room participants
CREATE TABLE IF NOT EXISTS realtime_room_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES realtime_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  cursor_position INTEGER,
  selection_start INTEGER,
  selection_end INTEGER
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_realtime_room_participants_room_id ON realtime_room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_realtime_room_participants_user_id ON realtime_room_participants(user_id);

-- Add realtime support to existing tables
ALTER TABLE resonance_scores ADD COLUMN IF NOT EXISTS realtime_broadcasted BOOLEAN DEFAULT FALSE;
ALTER TABLE resonance_scores ADD COLUMN IF NOT EXISTS broadcasted_at TIMESTAMPTZ;

-- Create function to clean up inactive connections
CREATE OR REPLACE FUNCTION cleanup_inactive_connections()
RETURNS void AS $$
BEGIN
  -- Mark connections as inactive if last activity was more than 10 minutes ago
  UPDATE realtime_connections 
  SET status = 'inactive' 
  WHERE last_activity < NOW() - INTERVAL '10 minutes' 
  AND status = 'active';
  
  -- Delete connections that have been inactive for more than 1 hour
  DELETE FROM realtime_connections 
  WHERE last_activity < NOW() - INTERVAL '1 hour' 
  AND status = 'inactive';
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old collaboration events
CREATE OR REPLACE FUNCTION cleanup_old_collaboration_events()
RETURNS void AS $$
BEGIN
  -- Delete collaboration events older than 7 days
  DELETE FROM collaboration_events 
  WHERE timestamp < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  -- Delete read notifications older than 30 days
  DELETE FROM realtime_notifications 
  WHERE read_at IS NOT NULL 
  AND created_at < NOW() - INTERVAL '30 days';
  
  -- Delete unread notifications older than 7 days
  DELETE FROM realtime_notifications 
  WHERE read_at IS NULL 
  AND created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to get active connections for a tenant
CREATE OR REPLACE FUNCTION get_active_connections(tenant_uuid UUID)
RETURNS TABLE (
  socket_id TEXT,
  user_id UUID,
  connected_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rc.socket_id,
    rc.user_id,
    rc.connected_at,
    rc.last_activity
  FROM realtime_connections rc
  WHERE rc.tenant_id = tenant_uuid
  AND rc.status = 'active'
  ORDER BY rc.last_activity DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get collaboration participants for content
CREATE OR REPLACE FUNCTION get_content_collaborators(content_id TEXT, content_type TEXT)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  joined_at TIMESTAMPTZ,
  last_activity TIMESTAMPTZ,
  cursor_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rrp.user_id,
    rrp.user_name,
    rrp.joined_at,
    rrp.last_activity,
    rrp.cursor_position
  FROM realtime_room_participants rrp
  JOIN realtime_rooms rr ON rrp.room_id = rr.id
  WHERE rr.content_id = content_id
  AND rr.type = content_type
  AND rrp.last_activity > NOW() - INTERVAL '5 minutes'
  ORDER BY rrp.last_activity DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to broadcast resonance update
CREATE OR REPLACE FUNCTION broadcast_resonance_update(
  content_id TEXT,
  scores JSONB,
  tenant_uuid UUID
)
RETURNS void AS $$
BEGIN
  -- Update resonance_scores table
  UPDATE resonance_scores 
  SET 
    realtime_broadcasted = TRUE,
    broadcasted_at = NOW()
  WHERE content_id = content_id
  AND tenant_id = tenant_uuid;
  
  -- Log the broadcast event
  INSERT INTO realtime_notifications (
    tenant_id,
    type,
    title,
    message,
    data
  ) VALUES (
    tenant_uuid,
    'resonance',
    'Resonance Update',
    'Resonance scores have been updated',
    jsonb_build_object('content_id', content_id, 'scores', scores)
  );
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically clean up inactive connections
CREATE OR REPLACE FUNCTION trigger_cleanup_inactive_connections()
RETURNS TRIGGER AS $$
BEGIN
  -- Run cleanup every time a connection is updated
  PERFORM cleanup_inactive_connections();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_connections_trigger
  AFTER UPDATE ON realtime_connections
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_cleanup_inactive_connections();

-- Create trigger to update room participant count
CREATE OR REPLACE FUNCTION update_room_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE realtime_rooms 
    SET participant_count = participant_count + 1,
        last_activity = NOW()
    WHERE id = NEW.room_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE realtime_rooms 
    SET participant_count = GREATEST(participant_count - 1, 0),
        last_activity = NOW()
    WHERE id = OLD.room_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_participant_count_trigger
  AFTER INSERT OR DELETE ON realtime_room_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_room_participant_count();

-- Insert initial system notifications
INSERT INTO realtime_notifications (tenant_id, type, title, message) VALUES
  ((SELECT id FROM tenants WHERE name = 'System' LIMIT 1), 'info', 'Real-time Infrastructure', 'Real-time collaboration and resonance updates are now active'),
  ((SELECT id FROM tenants WHERE name = 'System' LIMIT 1), 'success', 'Sprint 2 Complete', 'Real-time infrastructure has been successfully implemented');

-- Create views for easy querying
CREATE VIEW active_collaboration_sessions AS
SELECT 
  rr.id as room_id,
  rr.type as content_type,
  rr.content_id,
  rr.tenant_id,
  rr.created_at,
  rr.last_activity,
  rr.participant_count,
  array_agg(
    jsonb_build_object(
      'user_id', rrp.user_id,
      'user_name', rrp.user_name,
      'joined_at', rrp.joined_at,
      'last_activity', rrp.last_activity,
      'cursor_position', rrp.cursor_position
    )
  ) as participants
FROM realtime_rooms rr
LEFT JOIN realtime_room_participants rrp ON rr.id = rrp.room_id
WHERE rr.last_activity > NOW() - INTERVAL '5 minutes'
GROUP BY rr.id, rr.type, rr.content_id, rr.tenant_id, rr.created_at, rr.last_activity, rr.participant_count;

CREATE VIEW realtime_analytics AS
SELECT 
  tenant_id,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_connections,
  AVG(EXTRACT(EPOCH FROM (last_activity - connected_at))) as avg_session_duration,
  MAX(last_activity) as most_recent_activity
FROM realtime_connections
WHERE status = 'active'
GROUP BY tenant_id;





