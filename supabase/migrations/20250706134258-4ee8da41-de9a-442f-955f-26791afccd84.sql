-- Make bou.oussema@gmail.com an admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('63348778-cb58-4db4-bf3f-8e8168c12170', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;