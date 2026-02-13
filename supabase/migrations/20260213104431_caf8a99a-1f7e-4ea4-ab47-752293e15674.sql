
-- Create staff_notifications table
CREATE TABLE public.staff_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'assignment',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staff_notifications ENABLE ROW LEVEL SECURITY;

-- Staff can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.staff_notifications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Staff can update (mark read) their own notifications
CREATE POLICY "Users can update own notifications"
ON public.staff_notifications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Admins can insert notifications for anyone
CREATE POLICY "Admins can insert notifications"
ON public.staff_notifications
FOR INSERT
TO authenticated
WITH CHECK (is_staff_member(auth.uid()));

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_notifications;
