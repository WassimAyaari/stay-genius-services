

# Fix Role-Based Access Control (3-Tier System)

## Problem
Two issues are preventing proper role-based access:

1. **Duplicate role rows**: When a staff account is created, the database trigger `handle_new_user_role` automatically inserts a `user` role. Then the edge function inserts a second role (e.g., `moderator`). The `useUserRole` hook uses `.maybeSingle()` which breaks with multiple rows, so it may return `null` or `user` instead of the actual elevated role.

2. **Missing 3-tier filtering**: The sidebar only handles `moderator` filtering. There is no handling for the `staff` role, and the `is_staff_member` function needs to include `staff`.

## Desired Access Levels

| Role | Accessible Sections |
|------|---------------------|
| Staff | Dashboard, Restaurants |
| Moderator | Dashboard, Chat Manager, Housekeeping, Maintenance, Security, IT Support |
| Admin | Full access to everything |

## Changes

### 1. Fix the edge function to remove the default `user` role
**File**: `supabase/functions/create-staff-account/index.ts`

After creating the user and inserting the elevated role, delete the auto-inserted `user` role so each staff member has exactly one role entry:
```
DELETE FROM user_roles WHERE user_id = X AND role = 'user'
```

### 2. Fix existing duplicate roles in the database
**Migration**: Clean up existing duplicates -- for any user who has both a `user` role and an elevated role (`admin`/`moderator`/`staff`), remove the `user` row.

### 3. Update `useUserRole` hook to handle priority
**File**: `src/hooks/useUserRole.ts`

Instead of `.maybeSingle()`, fetch all roles for the user and pick the highest-priority one (`admin` > `moderator` > `staff` > `user`). This makes it resilient even if cleanup is incomplete.

### 4. Update `is_staff_member` to include `staff` role
**Migration**: Alter the function to check for `admin`, `moderator`, OR `staff`:
```sql
WHERE role IN ('admin', 'moderator', 'staff')
```

### 5. Add `staff` role filtering to the sidebar
**File**: `src/components/admin/AdminSidebar.tsx`

Add a `staffAllowedUrls` list and extend the filtering logic:
- If role is `staff`: show only Dashboard + Restaurants
- If role is `moderator`: show only Dashboard + Chat + Housekeeping + Maintenance + Security + IT Support
- If role is `admin` (or anything else for safety): show everything

### 6. Add route-level protection for moderators and staff
**File**: `src/components/admin/AdminSidebar.tsx` (or a new route guard)

If a moderator or staff member navigates directly to a restricted URL (e.g., `/admin/restaurants` for a moderator), redirect them to `/admin`.

## Technical Details

The edge function fix (step 1) ensures new accounts get a clean single role. The migration (step 2) fixes existing data. The hook fix (step 3) adds resilience. Steps 4-6 implement the 3-tier UI and access filtering.
