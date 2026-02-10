
CREATE TABLE public.admin_section_seen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, section_key)
);

ALTER TABLE public.admin_section_seen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage their own seen timestamps"
  ON public.admin_section_seen
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
