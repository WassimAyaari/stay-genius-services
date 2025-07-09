-- Add recurrence support to events table
ALTER TABLE public.events 
ADD COLUMN recurrence_type text DEFAULT 'once' CHECK (recurrence_type IN ('once', 'daily', 'weekly', 'monthly'));

-- Make date nullable for recurring events
ALTER TABLE public.events 
ALTER COLUMN date DROP NOT NULL;

-- Add constraint to ensure date is provided for non-recurring events
ALTER TABLE public.events 
ADD CONSTRAINT events_date_required_for_once CHECK (
  (recurrence_type = 'once' AND date IS NOT NULL) OR 
  (recurrence_type != 'once')
);