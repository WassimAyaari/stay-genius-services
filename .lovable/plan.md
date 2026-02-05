
# Plan: Auto-Assign "user" Role on Registration

## Overview
Create a database trigger that automatically assigns the "user" role to new users when they register through Supabase Auth.

## Current State
- The `app_role` enum already includes: `admin`, `moderator`, `user`
- The `user_roles` table exists with proper structure
- No trigger currently exists on `auth.users` for role assignment
- Registration creates users but doesn't assign any role

## Implementation

### Database Migration

Create a trigger function and trigger that fires when a new user is created:

```sql
-- Function to assign default user role
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role);
  RETURN NEW;
END;
$$;

-- Trigger that fires after user creation in auth.users
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();
```

## Technical Details

| Component | Description |
|-----------|-------------|
| Function | `handle_new_user_role()` - SECURITY DEFINER to bypass RLS |
| Trigger | `on_auth_user_created_assign_role` - fires AFTER INSERT on auth.users |
| Role assigned | `user` (existing enum value) |

### Why SECURITY DEFINER?
- The trigger runs in the context of the Supabase Auth system
- RLS on `user_roles` would block the insert without elevated permissions
- `SET search_path = public` prevents privilege escalation attacks

## Flow After Implementation

```text
Registration Flow:
┌─────────────────────┐
│  User fills form    │
│  (Stay Genius)      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  supabase.auth      │
│  .signUp()          │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  auth.users INSERT  │
└─────────┬───────────┘
          │
          ▼ (TRIGGER FIRES)
┌─────────────────────┐
│  user_roles INSERT  │
│  role = 'user'      │
└─────────────────────┘
```

## Verification
After registering a new user, verify with:
```sql
SELECT ur.*, au.email 
FROM user_roles ur 
JOIN auth.users au ON ur.user_id = au.id 
ORDER BY ur.created_at DESC 
LIMIT 5;
```

## Files Changed
- Database only (SQL migration) - no application code changes needed
