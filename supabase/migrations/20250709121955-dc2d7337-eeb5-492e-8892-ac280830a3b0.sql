-- Fix database schema consistency for booking system
-- Update table_reservations.time column to text for consistency with spa_bookings
ALTER TABLE public.table_reservations ALTER COLUMN time TYPE text;

-- Add better validation for date formats
-- Update existing records to ensure proper format
UPDATE public.table_reservations SET time = time::text WHERE time IS NOT NULL;

-- Add constraints to ensure data quality
ALTER TABLE public.table_reservations 
ADD CONSTRAINT check_date_format CHECK (date IS NOT NULL);

ALTER TABLE public.spa_bookings 
ADD CONSTRAINT check_spa_date_format CHECK (date IS NOT NULL);

ALTER TABLE public.spa_bookings 
ADD CONSTRAINT check_spa_time_format CHECK (time IS NOT NULL AND length(time) > 0);

ALTER TABLE public.table_reservations 
ADD CONSTRAINT check_table_time_format CHECK (time IS NOT NULL AND length(time) > 0);

-- Ensure event_reservations has proper constraints
ALTER TABLE public.event_reservations 
ADD CONSTRAINT check_event_date_format CHECK (date IS NOT NULL);

-- Add indexes for better performance on date/time queries
CREATE INDEX IF NOT EXISTS idx_spa_bookings_date_time ON public.spa_bookings(date, time);
CREATE INDEX IF NOT EXISTS idx_table_reservations_date_time ON public.table_reservations(date, time);
CREATE INDEX IF NOT EXISTS idx_event_reservations_date ON public.event_reservations(date);