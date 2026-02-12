
# Fix Staff Management Page Layout

## Problem
The Staff Management page is missing the standard padding and layout classes used by all other admin pages. It currently uses `space-y-6` but is missing `flex-1` and `p-6`.

Additionally, there is a duplicate "Last Name" field in the Create Staff dialog (introduced in the previous edit).

## Changes

### 1. Fix page container (`src/pages/admin/StaffManager.tsx`)
- Change `<div className="space-y-6">` to `<div className="flex-1 space-y-6 p-6">` to match the standard admin page pattern (e.g., GuestsManager).

### 2. Remove duplicate Last Name field (`src/pages/admin/staff/CreateStaffDialog.tsx`)
- The previous edit accidentally duplicated the "Last Name" FormField. Remove the extra one so the form has: First Name + Last Name (side by side), then Email, Role, Password, Confirm Password.
