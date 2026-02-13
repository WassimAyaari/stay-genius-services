

# Fix: Assign Dropdown Causing Table Layout Shift

## Problem
The `AssignToDropdown` component uses Radix `DropdownMenu` without `modal={false}`. By default, Radix modal dropdowns add `pointer-events: none` and adjust body padding/scroll when opened, which causes the entire page layout to shift slightly.

## Root Cause
Every other `DropdownMenu` in the project already uses `modal={false}` (e.g., `StaffTable.tsx`, `UserMenu.tsx`, `NotificationMenu.tsx`), but the newly created `AssignToDropdown.tsx` was missing it.

## Fix
One single change in `src/components/admin/AssignToDropdown.tsx`:

Change line 57 from:
```tsx
<DropdownMenu>
```
to:
```tsx
<DropdownMenu modal={false}>
```

This is a one-line fix in one file. No other changes needed.
