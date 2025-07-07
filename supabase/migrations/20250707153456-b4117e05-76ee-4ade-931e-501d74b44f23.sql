-- Enable Row Level Security on companions table
ALTER TABLE public.companions ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own companions
CREATE POLICY "Users can view their own companions" 
ON public.companions 
FOR SELECT 
USING (auth.uid()::text = user_id);

-- Policy for users to insert their own companions
CREATE POLICY "Users can insert their own companions" 
ON public.companions 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Policy for users to update their own companions
CREATE POLICY "Users can update their own companions" 
ON public.companions 
FOR UPDATE 
USING (auth.uid()::text = user_id);

-- Policy for users to delete their own companions
CREATE POLICY "Users can delete their own companions" 
ON public.companions 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Admin policy for full access
CREATE POLICY "Admins can manage all companions" 
ON public.companions 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert companions" 
ON public.companions 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));