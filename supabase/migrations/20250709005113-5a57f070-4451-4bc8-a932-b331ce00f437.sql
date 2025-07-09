-- Enable RLS on service_requests table
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own service requests
CREATE POLICY "Users can view their own service requests" 
ON public.service_requests 
FOR SELECT 
USING (guest_id = auth.uid()::text);

-- Allow users to update their own service requests (for cancellation)
CREATE POLICY "Users can update their own service requests" 
ON public.service_requests 
FOR UPDATE 
USING (guest_id = auth.uid()::text);

-- Allow admins to manage all service requests
CREATE POLICY "Admins can manage all service requests" 
ON public.service_requests 
FOR ALL 
USING (is_admin(auth.uid()));

-- Allow AI/system to create service requests
CREATE POLICY "Allow service request creation" 
ON public.service_requests 
FOR INSERT 
WITH CHECK (true);