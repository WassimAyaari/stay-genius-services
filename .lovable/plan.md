

# Fix: Moderator Access to Admin Panel

## Problem
The `is_user_admin` database function only checks for the `admin` role. When a moderator logs in, three things go wrong:
1. **Login redirect**: The login form calls `is_user_admin` which returns `false` for moderators, so they get sent to `/` instead of `/admin`
2. **Auth guard**: The `adminRequired` check in `useAuthGuard` also uses `is_user_admin`, so navigating to `/admin` manually shows "Access restricted"
3. **Sidebar**: All menu sections are visible -- moderators should only see their allowed sections

## Solution

### 1. New database function: `is_staff_member`
Create a SQL function that returns `true` if the user has `admin` OR `moderator` role. This will be used for access control to the admin panel.

```sql
CREATE OR REPLACE FUNCTION public.is_staff_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'moderator')
  )
$$;
```

### 2. Update login redirect
**File**: `src/pages/auth/components/LoginForm.tsx`
- Replace `is_user_admin` with `is_staff_member` in the post-login redirect check
- Moderators and admins both go to `/admin`

### 3. Update auth guard
**File**: `src/features/auth/hooks/useAuthGuard.ts`
- Replace `is_user_admin` with `is_staff_member` when checking `adminRequired`
- Both admins and moderators pass the guard

### 4. Create a `useUserRole` hook
**File**: `src/hooks/useUserRole.ts`
- Fetches the current user's role from `user_roles` table
- Returns `{ role, loading }` so components can conditionally render based on role

### 5. Filter sidebar by role
**File**: `src/components/admin/AdminSidebar.tsx`
- Use the `useUserRole` hook to get the current role
- Define which sections moderators can access: Dashboard, Chat Manager, Housekeeping, Maintenance, Security, IT Support
- Filter `navigationSections` before rendering -- admins see everything, moderators see only their allowed items

### Moderator-Visible Sections
| Section | Items |
|---------|-------|
| Overview | Dashboard |
| Guest Management | Chat Manager only |
| Services | Housekeeping, Maintenance, Security, IT Support |

All other sections (F&B, Wellness, Entertainment, Hotel Info, Administration) are hidden for moderators.

