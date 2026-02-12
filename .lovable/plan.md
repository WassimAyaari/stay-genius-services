
# Implement "Change Role" Feature for Staff Management

## Problem
The "Change Role" button in the Staff Management page currently shows a "Coming soon" toast. Admins need the ability to update roles for any staff member, including other admins, with proper validation to prevent self-demotion.

## Solution Overview
Implement a complete role-editing workflow using a new dialog component and backend edge function, following the existing patterns from CreateStaffDialog and DeleteStaffDialog.

## Implementation Steps

### 1. Create Edge Function: `update-staff-role`
**File**: `supabase/functions/update-staff-role/index.ts`

This function will:
- Verify the caller is an admin (using `has_role` RPC)
- Prevent self-demotion (caller cannot change their own role to a lower privilege)
- Delete the old role record and insert the new one in the `user_roles` table
- Return success/error responses with proper error handling

**Key Logic**:
```typescript
// 1. Verify admin access
// 2. Check if user_id === callerId && new_role is lower privilege → reject
// 3. Delete old role: DELETE FROM user_roles WHERE user_id = X AND role != new_role
// 4. Insert new role: INSERT INTO user_roles (user_id, role)
// 5. Return success
```

### 2. Create EditRoleDialog Component
**File**: `src/pages/admin/staff/EditRoleDialog.tsx`

This dialog will:
- Display current role and allow selection of new role
- Include form validation with Zod
- Prevent admins from demoting themselves
- Call the new edge function to update the role
- Show loading state during submission

**Form Schema**:
```typescript
const editRoleSchema = z.object({
  new_role: z.enum(['staff', 'moderator', 'admin'], {
    required_error: 'Please select a role',
  }),
});
```

**Props**:
- `open: boolean`
- `onOpenChange: (open: boolean) => void`
- `member: StaffMember | null` (staff member to edit)
- `currentUserRole: string | null` (current logged-in user's role)
- `onSuccess: () => void` (callback to refresh list)

### 3. Update StaffManager Component
**File**: `src/pages/admin/StaffManager.tsx`

Changes:
- Add state for edit dialog: `editOpen` and `staffToEdit`
- Update `handleEditRole` to open the dialog instead of showing toast
- Get the current user's role using the existing `useUserRole` hook
- Add the EditRoleDialog component to the JSX
- Pass the role to EditRoleDialog for self-demotion validation

### 4. Self-Demotion Validation Logic
Implement on both frontend and backend:

**Frontend** (EditRoleDialog):
- If `member.user_id === currentUserId` and attempting to lower privilege, show warning
- Disable role options that would result in demotion

**Backend** (edge function):
- Get caller's role using `has_role` RPC
- Role hierarchy: `admin` (3) > `moderator` (2) > `staff` (1)
- If `callerId === userId` and new role is lower, return 400 error

### 5. UI/UX Considerations
- Show current role in the dialog header/description
- Disabled state for role options that aren't allowed
- Clear warning messages for self-demotion attempts
- Success toast with updated role name
- Consistent styling with other dialogs

## Technical Architecture

```
StaffManager
├── EditRoleDialog (new)
│   └── Calls edge function: update-staff-role
└── Edge Function: update-staff-role
    └── Updates user_roles table via service role
```

## Security Considerations
1. **Edge function validates admin access** - Uses `has_role('admin')` RPC
2. **Self-demotion prevention** - Both frontend and backend prevent admins from demoting themselves
3. **Service role for updates** - Uses service role key for write operations to bypass RLS
4. **Input validation** - Zod validation on role selection
5. **Authorization checks** - Ensures only admins can change roles

## Files to Create/Edit
- Create: `supabase/functions/update-staff-role/index.ts` (edge function)
- Create: `src/pages/admin/staff/EditRoleDialog.tsx` (dialog component)
- Edit: `src/pages/admin/StaffManager.tsx` (add state and integrate dialog)

