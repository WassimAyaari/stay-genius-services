

# Fix: Staff Name and Email Not Displayed

## Problem
When a staff/moderator account is created, the name and email fields appear blank in the Staff Management table. This is because the `create-staff-account` edge function no longer inserts a record into the `guests` table (removed in a previous fix), but the `StaffManager` still looks up name and email from that table.

## Solution
Re-add the `guests` table insert in the edge function. The `guests` table serves as the profile store for all users. The Guest 360 page already filters out staff users, so adding staff to `guests` won't cause them to appear in the wrong list.

## Changes

### 1. Update `create-staff-account` edge function
**File**: `supabase/functions/create-staff-account/index.ts`

After inserting the role, add a `guests` insert:
```typescript
await supabaseAdmin.from("guests").insert({
  user_id: newUser.user.id,
  first_name,
  last_name,
  email,
  guest_type: "Staff",
});
```

This restores the profile data that `StaffManager` relies on. The `GuestsManager` already excludes users with staff/admin/moderator roles, so they won't appear in the guest list.

### 2. No other changes needed
The `StaffManager` fetch logic already handles this correctly -- it joins `user_roles` with `guests` to get the name and email. The only missing piece was the `guests` insert.

