
# Fix: Restore Dark Backdrop on Admin Staff Dialogs

## Problem
The three admin staff dialogs (Create, Edit Role, Delete) have `modal={false}` to prevent layout shift, but are missing the manual dark backdrop (`bg-black/80`) that was added to the profile dialogs.

## Solution
Add the same manual backdrop pattern already used in the profile dialogs to all three admin staff dialogs.

## Files to Edit

### 1. `src/pages/admin/staff/CreateStaffDialog.tsx`
- Wrap the return in a fragment
- Add `{open && <div className="fixed inset-0 z-50 bg-black/80" onClick={() => onOpenChange(false)} />}` before the `<Dialog>` component

### 2. `src/pages/admin/staff/EditRoleDialog.tsx`
- Wrap the return in a fragment
- Add `{open && <div className="fixed inset-0 z-50 bg-black/80" onClick={() => onOpenChange(false)} />}` before the `<Dialog>` component

### 3. `src/pages/admin/staff/DeleteStaffDialog.tsx`
- Wrap the return in a fragment
- Add `{open && <div className="fixed inset-0 z-50 bg-black/80" onClick={() => onOpenChange(false)} />}` before the `<AlertDialog>` component
- Note: The `AlertDialog` here does not currently have `modal={false}` -- this will be added as well to prevent layout shift, consistent with all other dialogs

## Result
All three admin staff dialogs will show the dark semi-transparent backdrop when open, matching the profile dialogs and the expected behavior shown in the user's earlier screenshot.
