
-- Add the user ammna.jmal@gmail.com as an admin
-- First, we need to find the user ID from the auth.users table and add them to the user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'ammna.jmal@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
