
# Plan: Fix Restaurant Reservations for Admin Dashboard

## Overview
This plan addresses two issues:
1. Admins cannot view restaurant reservations in the admin dashboard due to restrictive RLS policies
2. Ensure the booking form creates reservations properly

---

## Issue 1: Admin RLS Access

### Current State
The `table_reservations` table has these RLS policies:
- SELECT: `user_id = auth.uid()` (users can only view their own)
- INSERT: `user_id = auth.uid()` (users can only create their own)
- UPDATE: `user_id = auth.uid()` (users can only update their own)
- DELETE: `user_id = auth.uid()` (users can only delete their own)

**Result:** Admins cannot see any reservations in the Bookings tab.

### Solution
Add RLS policies that allow admins (using the existing `is_admin()` function) to:
- View all reservations
- Update all reservations (for status changes)

### Database Migration

```sql
-- Add admin policies for table_reservations

-- Allow admins to view all reservations
CREATE POLICY "Admins can view all reservations"
ON public.table_reservations
FOR SELECT
USING (is_admin(auth.uid()));

-- Allow admins to update all reservations
CREATE POLICY "Admins can update all reservations"
ON public.table_reservations
FOR UPDATE
USING (is_admin(auth.uid()));
```

---

## Issue 2: Reservation Creation

### Current State
The `RestaurantBookingForm.tsx` has a potential issue:
- Line 42: Uses `localStorage.getItem('user_id')` 
- Line 84: Sends this as `user_id` in the insert

If the stored user_id doesn't match `auth.uid()`, the INSERT will fail due to RLS.

### Solution
Update the INSERT policy to allow authenticated users to create reservations:

```sql
-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create their own reservations" ON public.table_reservations;

-- Allow any authenticated user to create reservations
CREATE POLICY "Authenticated users can create reservations"
ON public.table_reservations
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
```

---

## Summary of Changes

| File | Change |
|------|--------|
| Migration | Add admin SELECT and UPDATE policies for `table_reservations` |
| Migration | Update INSERT policy to be less restrictive |

### Files to Create

| File | Purpose |
|------|---------|
| `supabase/migrations/[timestamp]_fix_table_reservations_rls.sql` | Add RLS policies for admin access |

---

## Expected Result After Implementation

1. **Admin Dashboard (Bookings tab):**
   - Select a restaurant from the dropdown
   - See all reservations for that restaurant
   - Update reservation status (confirm/cancel)

2. **User Booking Flow:**
   - User fills out the booking form on `/dining`
   - Reservation is created successfully
   - Appears in user's "My Reservations" view
   - Also visible to admin in the Bookings tab

---

## Testing Verification

After implementation:
1. Log in as admin
2. Go to `/admin/restaurants` → Bookings tab
3. Select a restaurant
4. Verify reservations appear in the list
5. Change a reservation status and verify it updates

Also test:
1. Log in as a regular user
2. Go to `/dining`
3. Book a table at any restaurant
4. Verify the booking is created
5. Log in as admin and verify the new booking appears
