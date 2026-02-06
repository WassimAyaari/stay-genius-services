-- Add notification-related tables to realtime publication
-- This enables real-time updates for spa bookings, table reservations, and service requests
ALTER PUBLICATION supabase_realtime ADD TABLE spa_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE table_reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;