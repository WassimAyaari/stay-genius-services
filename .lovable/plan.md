

# Fix: Table Layout Shift When Opening Dropdowns/Dialogs

## Problem
When you click the three-dot menu on a staff row or "Create Staff," the page content shifts slightly. This happens because Radix UI's default modal behavior locks the body scroll by hiding the scrollbar, which changes the page width and causes the table to reflow.

## Root Cause
The `DropdownMenu` in StaffTable and the `Dialog`/`AlertDialog` components in CreateStaffDialog, DeleteStaffDialog, and EditRoleDialog all use the default `modal={true}` behavior. When they open, Radix adds `data-scroll-locked` to the body, hiding the scrollbar and causing a layout shift. The project already applies `modal={false}` to UserMenu and NotificationMenu dropdowns to prevent this exact issue, but it was not applied to the Staff Management components.

## Fix
Add `modal={false}` to all four components that trigger this shift:

### 1. StaffTable.tsx -- DropdownMenu
Add `modal={false}` to the `DropdownMenu` component wrapping the three-dot actions menu.

### 2. CreateStaffDialog.tsx -- Dialog
Add `modal={false}` to the `Dialog` component.

### 3. DeleteStaffDialog.tsx -- AlertDialog
Add `modal={false}` to the `AlertDialog` component.

### 4. EditRoleDialog.tsx -- Dialog
Add `modal={false}` to the `Dialog` component.

## Scope
Each change is a single prop addition (`modal={false}`) on one line per file. No other logic or styling changes are needed.

