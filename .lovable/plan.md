

# Implement Staff Account Deletion

## Overview
Currently, clicking "Delete Account" on a staff member shows a "Coming soon" toast. We need to make it fully functional with a confirmation dialog and a new edge function that uses the service role to delete the user from `auth.users` (which cascades to `user_roles`, `guests`, etc.).

## Changes

### 1. New Edge Function: `delete-staff-account`
**File**: `supabase/functions/delete-staff-account/index.ts`

- Accepts `{ user_id }` in the request body
- Verifies the caller is an admin (same pattern as `create-staff-account`)
- Prevents self-deletion (admin cannot delete their own account)
- Uses `supabaseAdmin.auth.admin.deleteUser(user_id)` to remove the user
- Foreign key cascades will automatically clean up `user_roles`, `guests`, `conversations`, etc.

### 2. Confirmation Dialog: `DeleteStaffDialog`
**File**: `src/pages/admin/staff/DeleteStaffDialog.tsx`

- AlertDialog with warning message showing the staff member's name and email
- Confirm/Cancel buttons
- Loading state on the confirm button while deletion is in progress

### 3. Update StaffManager to wire up deletion
**File**: `src/pages/admin/StaffManager.tsx`

- Add state for the delete dialog (`deleteOpen`, `staffToDelete`)
- Replace the placeholder `handleDelete` with logic that opens the confirmation dialog
- On confirm, call the `delete-staff-account` edge function
- On success, show a success toast and refresh the staff list

### Technical Details

```text
User clicks "Delete Account"
       |
       v
  Confirmation Dialog opens
       |
       v
  User confirms --> POST /delete-staff-account { user_id }
       |
       v
  Edge function verifies admin --> deletes user via admin API
       |
       v
  Cascade deletes user_roles, guests, etc.
       |
       v
  Success toast + refresh list
```

The edge function follows the exact same auth pattern as `create-staff-account` (verify JWT, check admin role via `has_role` RPC, then use service role client for the privileged operation).

