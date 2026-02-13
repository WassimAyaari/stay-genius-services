
ALTER TABLE public.service_requests 
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS assigned_to_name text;
