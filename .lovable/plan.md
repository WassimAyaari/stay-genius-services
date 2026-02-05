
# Plan: Fix Admin RLS Policies for Restaurant Reservations

## Problem Identified
The RLS policies created for `table_reservations` use the wrong admin check function:

- **Currently using:** `is_admin(auth.uid())` - checks `auth.users.raw_app_meta_data->>'is_admin' = 'true'`
- **Should use:** `is_user_admin(auth.uid())` - checks the `user_roles` table where admin roles are actually stored

The user ammna.jmal@gmail.com has admin role in `user_roles` table but not in `raw_app_meta_data`, so the RLS policies are blocking their access.

## Solution
Update the RLS policies to use the correct function that checks the `user_roles` table.

## Database Migration

Drop the incorrect policies and create new ones with the correct function:

```sql
-- Drop incorrect policies
DROP POLICY IF EXISTS "Admins can view all reservations" ON public.table_reservations;
DROP POLICY IF EXISTS "Admins can update all reservations" ON public.table_reservations;

-- Create correct policies using is_user_admin
CREATE POLICY "Admins can view all reservations"
ON public.table_reservations
FOR SELECT
USING (is_user_admin(auth.uid()));

CREATE POLICY "Admins can update all reservations"
ON public.table_reservations
FOR UPDATE
USING (is_user_admin(auth.uid()));
```

## Expected Result

After this fix:
1. Admins (users with 'admin' role in `user_roles` table) can see all reservations in the Bookings tab
2. Admins can update reservation status (confirm/cancel)
3. Regular users continue to only see their own reservations

## Testing Steps
1. Log in as admin (ammna.jmal@gmail.com)
2. Go to Admin Panel → Restaurants → Bookings tab
3. Select a restaurant (e.g., Allegria)
4. Verify reservations appear in the list
