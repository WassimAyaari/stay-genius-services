CREATE POLICY "Staff can view all service requests"
ON public.service_requests
FOR SELECT
TO authenticated
USING (is_staff_member(auth.uid()));