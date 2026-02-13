

# Fix: Moderators Cannot See Service Requests

## Problem
The `test@housekeeping.com` user has the **moderator** role, but the RLS policy "Admins can manage all service requests" on the `service_requests` table uses the `is_admin()` function, which only checks for the `admin` role. Moderators are therefore blocked from reading service requests at the database level.

## Root Cause
- `is_admin(uid)` checks: `role = 'admin'` (exact match)
- `is_staff_member(uid)` checks: `role IN ('admin', 'moderator', 'staff')`
- The RLS policy uses `is_admin()`, so only admins pass the check

## Solution
Add a new RLS SELECT policy on `service_requests` that allows staff members (including moderators) to view all service requests. This uses the existing `is_staff_member()` function.

### SQL Migration

```sql
CREATE POLICY "Staff can view all service requests"
ON public.service_requests
FOR SELECT
TO authenticated
USING (is_staff_member(auth.uid()));
```

This grants moderators (and staff) read access to all service requests, matching the admin's existing visibility. The existing "Admins can manage all service requests" policy (ALL command) remains for full CRUD by admins.

## Files to Modify
No code changes needed -- this is a database-only fix (one new RLS policy).

