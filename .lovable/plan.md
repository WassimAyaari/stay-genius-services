

# Fix: Staff Members Appearing in Guests After Deletion

## Problem
When a staff account is deleted from Staff Management, the person reappears in the Guest 360 list. This happens because:

1. The `create-staff-account` function inserts a record in the `guests` table (with `guest_type: "Staff"`)
2. The `delete-staff-account` function only deletes the auth user -- it does **not** clean up the `guests` table record
3. The Guest 360 page filters staff by checking `user_roles`, but after deletion, the role record is gone, so the orphaned guest record passes through the filter

## Solution (Two-Layer Fix)

### 1. Delete the guest record when deleting a staff account
**File**: `supabase/functions/delete-staff-account/index.ts`

Before deleting the auth user, explicitly delete the corresponding `guests` row using the service-role client:

```typescript
// Delete guest profile for this staff member
await supabaseAdmin.from("guests").delete().eq("user_id", user_id);
```

This ensures no orphaned guest record is left behind.

### 2. Add a secondary filter in Guest 360
**File**: `src/pages/admin/GuestsManager.tsx`

In addition to the existing `user_roles` check, also exclude guests where `guest_type` is `"Staff"`. This acts as a safety net for any edge cases:

```typescript
return (data || []).filter(
  (guest) =>
    guest.guest_type !== 'Staff' &&
    (!guest.user_id || !staffUserIds.has(guest.user_id))
);
```

## Files to Edit
- `supabase/functions/delete-staff-account/index.ts` -- add guest record cleanup before auth deletion
- `src/pages/admin/GuestsManager.tsx` -- add `guest_type` filter as secondary defense

