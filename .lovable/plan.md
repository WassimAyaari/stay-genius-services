

# Fix: Add Item and Edit Item Dialogs Causing Layout Shift

## Problem
Same root cause as the previous Assign dropdown fix. The `AddItemDialog` and `EditItemDialog` components use Radix `Dialog` in default modal mode. When opened, Radix removes the body scrollbar and adds padding to compensate, causing the entire page to shift slightly.

## Solution
Apply the same pattern already used throughout the project (e.g., `CreateStaffDialog`, `EditRoleDialog`, `AddPreferenceDialog`):

1. Set `modal={false}` on the `Dialog` component
2. Add a manual backdrop overlay (`div` with `bg-black/80`) that appears when the dialog is open

## Files to Edit

### 1. `src/pages/admin/housekeeping/components/AddItemDialog.tsx`
- Wrap the `Dialog` in a fragment
- Add a backdrop div: `{isOpen && <div className="fixed inset-0 z-50 bg-black/80" onClick={() => onOpenChange(false)} />}`
- Change `<Dialog open={isOpen} onOpenChange={onOpenChange}>` to `<Dialog open={isOpen} onOpenChange={onOpenChange} modal={false}>`

### 2. `src/pages/admin/housekeeping/components/EditItemDialog.tsx`
- Same changes: wrap in fragment, add backdrop div, add `modal={false}`

Both changes follow the exact pattern already established in:
- `CreateStaffDialog.tsx`
- `EditRoleDialog.tsx`
- `AddPreferenceDialog.tsx`
- `AddMedicalAlertDialog.tsx`
