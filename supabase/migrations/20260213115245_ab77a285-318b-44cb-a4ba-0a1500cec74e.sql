CREATE POLICY "Staff can update service requests"
ON public.service_requests
FOR UPDATE
USING (is_staff_member(auth.uid()));