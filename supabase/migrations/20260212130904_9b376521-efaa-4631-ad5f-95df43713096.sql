
-- Fix event_reservations FK
ALTER TABLE event_reservations DROP CONSTRAINT event_reservations_user_id_fkey;
ALTER TABLE event_reservations ADD CONSTRAINT event_reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix spa_bookings FK
ALTER TABLE spa_bookings DROP CONSTRAINT spa_bookings_user_id_fkey;
ALTER TABLE spa_bookings ADD CONSTRAINT spa_bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix table_reservations FK
ALTER TABLE table_reservations DROP CONSTRAINT table_reservations_user_id_fkey;
ALTER TABLE table_reservations ADD CONSTRAINT table_reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix conversations guest_id FK
ALTER TABLE conversations DROP CONSTRAINT conversations_guest_id_fkey;
ALTER TABLE conversations ADD CONSTRAINT conversations_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix conversations assigned_staff_id FK
ALTER TABLE conversations DROP CONSTRAINT conversations_assigned_staff_id_fkey;
ALTER TABLE conversations ADD CONSTRAINT conversations_assigned_staff_id_fkey FOREIGN KEY (assigned_staff_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Fix messages sender_id FK
ALTER TABLE messages DROP CONSTRAINT messages_sender_id_fkey;
ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Fix chat_routing staff_id FK
ALTER TABLE chat_routing DROP CONSTRAINT chat_routing_staff_id_fkey;
ALTER TABLE chat_routing ADD CONSTRAINT chat_routing_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES auth.users(id) ON DELETE SET NULL;
