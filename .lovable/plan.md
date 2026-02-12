

# Fix: Separate Staff from Guests

## Problem
When creating a staff account, the edge function inserts a record into the `guests` table. This causes staff/admin accounts to appear in the Guest 360 list, which should only show regular users.

## Root Cause
The `create-staff-account` edge function has this line that inserts every new staff member into the `guests` table:
```typescript
await supabaseAdmin.from("guests").insert({
  user_id: newUser.user.id,
  first_name, last_name, email,
  guest_type: "Staff",
});
```

Additionally, the GuestsManager query fetches **all** records from the `guests` table without filtering out staff accounts.

## Solution

### 1. Remove guest insertion from the edge function
**File**: `supabase/functions/create-staff-account/index.ts`
- Remove the block that inserts into the `guests` table. Staff members are not guests and should not appear there.

### 2. Filter the Guests list to exclude staff users
**File**: `src/pages/admin/GuestsManager.tsx`
- After fetching guests, cross-reference with `user_roles` to exclude users who have non-"user" roles (admin, moderator, staff).
- Query `user_roles` for roles other than `user`, collect those `user_id`s, then filter them out of the guest list.

### 3. Clean up existing data
- The "hotel genius" admin account already exists in the `guests` table. The code fix will filter it out going forward. Optionally, a note can be provided to manually delete that record from the `guests` table via the Supabase dashboard.

## Expected Result
- Staff Management shows only admin/moderator/staff accounts
- Guest 360 shows only regular user (guest) accounts
- Future staff account creation will not pollute the guests table

