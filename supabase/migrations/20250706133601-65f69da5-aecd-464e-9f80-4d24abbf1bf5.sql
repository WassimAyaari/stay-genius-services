-- Create demo settings table for admin control
CREATE TABLE IF NOT EXISTS public.demo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled BOOLEAN DEFAULT true,
  time_limit_minutes INTEGER DEFAULT 5,
  redirect_url TEXT DEFAULT 'https://hotelgenius.app',
  email_required BOOLEAN DEFAULT true,
  expiration_message TEXT DEFAULT 'Your demo has expired. Request a full demo to continue exploring our solution.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create demo sessions table for analytics
CREATE TABLE IF NOT EXISTS public.demo_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on demo settings (admin only)
ALTER TABLE public.demo_settings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on demo sessions (admin only)
ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;

-- Demo settings policies (admin only)
CREATE POLICY "Admins can manage demo settings" 
ON public.demo_settings 
FOR ALL 
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Demo sessions policies (admin only)
CREATE POLICY "Admins can view demo sessions" 
ON public.demo_sessions 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can create demo sessions" 
ON public.demo_sessions 
FOR INSERT 
WITH CHECK (true);

-- Insert default demo settings
INSERT INTO public.demo_settings (is_enabled, time_limit_minutes, redirect_url, email_required, expiration_message)
VALUES (true, 5, 'https://hotelgenius.app', true, 'Your demo has expired. Request a full demo to continue exploring our solution.')
ON CONFLICT DO NOTHING;

-- Add trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_demo_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_demo_settings_updated_at
    BEFORE UPDATE ON public.demo_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_demo_settings_updated_at();