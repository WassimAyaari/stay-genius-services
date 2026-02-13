
CREATE TABLE public.moderator_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  service_type text NOT NULL CHECK (service_type IN ('housekeeping', 'maintenance', 'security', 'it_support')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.moderator_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage moderator services"
  ON public.moderator_services FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Moderators can view own service"
  ON public.moderator_services FOR SELECT
  USING (auth.uid() = user_id);
