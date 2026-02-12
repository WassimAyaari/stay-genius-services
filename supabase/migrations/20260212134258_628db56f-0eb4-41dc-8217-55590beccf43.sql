
-- 1. Update is_staff_member to include 'staff' role
CREATE OR REPLACE FUNCTION public.is_staff_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'moderator', 'staff')
  )
$$;

-- 2. Clean up duplicate 'user' roles for users who have an elevated role
DELETE FROM public.user_roles
WHERE role = 'user'::app_role
AND user_id IN (
  SELECT user_id FROM public.user_roles
  WHERE role IN ('admin', 'moderator', 'staff')
);
