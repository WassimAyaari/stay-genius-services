

# Staff Management Section

## Overview
Create a new "Staff Management" admin page where admins can create staff accounts with role assignments, view existing staff members, search/filter them, and manage their roles.

## Roles Definition
- **Admin**: Full access to all admin features
- **Moderator**: Access to Chat, Housekeeping, Maintenance, and Security sections
- **Staff**: Basic staff access (limited admin panel visibility)
- **User (Guest)**: Public pages, profile, and reservations only (existing default role)

## Changes Required

### 1. Database: Add "staff" to the app_role enum
- Run a migration to add `'staff'` to the `app_role` enum type
- Update the TypeScript types to include `"staff"`

### 2. Edge Function: `create-staff-account`
- New Supabase Edge Function at `supabase/functions/create-staff-account/index.ts`
- Accepts: first_name, last_name, email, password, role
- Uses the **service role key** to call `supabase.auth.admin.createUser()` (creates the user without email confirmation)
- Inserts a record into `user_roles` with the chosen role
- Optionally inserts into `guests` table for profile data
- Validates that the calling user is an admin (checks their JWT)

### 3. New Admin Page: `src/pages/admin/StaffManager.tsx`
- Header with icon, title "Staff Management", and subtitle "Manage staff accounts (moderators and staff)"
- "Create Staff" button (primary) and "Refresh" button
- Search bar to filter by name or email
- Table/list of all staff accounts showing: name, email, role, created date
- Each row has actions: edit role, delete account
- Empty state when no staff found

### 4. Create Staff Dialog
- Modal dialog with form fields:
  - First Name + Last Name (side by side)
  - Email
  - Role (dropdown: Staff, Moderator, Admin)
  - Password + Confirm Password
- "Create Account" button
- Validation with Zod schema
- Calls the edge function on submit

### 5. Sidebar Update: `AdminSidebar.tsx`
- Add "Staff Management" link under the "Administration" section
- Icon: `Users` (from lucide-react) or `UserCog`
- URL: `/admin/staff`

### 6. Route Registration: `AdminRoutes.tsx`
- Add route: `<Route path="staff" element={<StaffManager />} />`

### 7. Role-Based Access Control (future-ready)
- The `AuthGuard` and `useAuthGuard` hook currently only check for `admin` role
- For moderators/staff, the existing `is_user_admin` check will need to also accept moderator/staff for relevant sections
- This plan focuses on the staff creation UI; granular role enforcement can be added incrementally

## Technical Details

### Edge Function Security
- Verifies the calling user's JWT token
- Checks the caller has the `admin` role via `has_role()` database function
- Uses `SUPABASE_SERVICE_ROLE_KEY` to create auth users (required for admin user creation)

### Files to Create
- `supabase/functions/create-staff-account/index.ts` -- edge function
- `src/pages/admin/StaffManager.tsx` -- main page component
- `src/pages/admin/staff/CreateStaffDialog.tsx` -- create dialog component
- `src/pages/admin/staff/StaffTable.tsx` -- staff list table component

### Files to Modify
- `src/components/admin/AdminSidebar.tsx` -- add nav item
- `src/routes/AdminRoutes.tsx` -- add route
- `src/integrations/supabase/types.ts` -- update app_role enum type
- New SQL migration -- add 'staff' to enum

