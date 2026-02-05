-- Add admin policies for table_reservations

-- Allow admins to view all reservations
CREATE POLICY "Admins can view all reservations"
ON public.table_reservations
FOR SELECT
USING (is_admin(auth.uid()));

-- Allow admins to update all reservations
CREATE POLICY "Admins can update all reservations"
ON public.table_reservations
FOR UPDATE
USING (is_admin(auth.uid()));

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create their own reservations" ON public.table_reservations;

-- Allow any authenticated user to create reservations
CREATE POLICY "Authenticated users can create reservations"
ON public.table_reservations
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);