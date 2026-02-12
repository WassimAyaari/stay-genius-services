
-- Create guest_preferences table
CREATE TABLE public.guest_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create guest_medical_alerts table
CREATE TABLE public.guest_medical_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_medical_alerts ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user owns the guest record
CREATE OR REPLACE FUNCTION public.owns_guest_record(_user_id uuid, _guest_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.guests
    WHERE id = _guest_id AND user_id = _user_id
  )
$$;

-- guest_preferences RLS policies
CREATE POLICY "Users can view own preferences"
  ON public.guest_preferences FOR SELECT
  USING (public.owns_guest_record(auth.uid(), guest_id));

CREATE POLICY "Users can insert own preferences"
  ON public.guest_preferences FOR INSERT
  WITH CHECK (public.owns_guest_record(auth.uid(), guest_id));

CREATE POLICY "Users can delete own preferences"
  ON public.guest_preferences FOR DELETE
  USING (public.owns_guest_record(auth.uid(), guest_id));

CREATE POLICY "Admins can view all preferences"
  ON public.guest_preferences FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all preferences"
  ON public.guest_preferences FOR ALL
  USING (public.is_admin(auth.uid()));

-- guest_medical_alerts RLS policies
CREATE POLICY "Users can view own alerts"
  ON public.guest_medical_alerts FOR SELECT
  USING (public.owns_guest_record(auth.uid(), guest_id));

CREATE POLICY "Users can insert own alerts"
  ON public.guest_medical_alerts FOR INSERT
  WITH CHECK (public.owns_guest_record(auth.uid(), guest_id));

CREATE POLICY "Users can delete own alerts"
  ON public.guest_medical_alerts FOR DELETE
  USING (public.owns_guest_record(auth.uid(), guest_id));

CREATE POLICY "Admins can view all alerts"
  ON public.guest_medical_alerts FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage all alerts"
  ON public.guest_medical_alerts FOR ALL
  USING (public.is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_guest_preferences_guest_id ON public.guest_preferences(guest_id);
CREATE INDEX idx_guest_medical_alerts_guest_id ON public.guest_medical_alerts(guest_id);
