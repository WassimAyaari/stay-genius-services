
CREATE TABLE public.guest_staff_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id uuid NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_staff_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage all notes" ON public.guest_staff_notes
FOR ALL USING (is_staff_member(auth.uid()));

CREATE POLICY "Staff can view all notes" ON public.guest_staff_notes
FOR SELECT USING (is_staff_member(auth.uid()));
