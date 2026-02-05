-- Drop incorrect policies
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.table_reservations;
DROP POLICY IF EXISTS "Admins can update all reservations" ON public.table_reservations;

-- Create correct policies using is_user_admin (checks user_roles table)
CREATE POLICY "Admins can view all reservations"
ON public.table_reservations
FOR SELECT
USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update all reservations"
ON public.table_reservations
FOR UPDATE
USING (is_user_admin(auth.uid()));