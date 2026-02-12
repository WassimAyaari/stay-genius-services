

## Problem Analysis
The "Create Staff" dialog shifts when focusing inputs or clicking buttons. This is caused by:

1. **Form validation errors appearing/disappearing**: When validation errors appear below fields, they increase the form height, causing the dialog to reposition
2. **Select dropdown modal behavior**: The role Select component doesn't have `modal={false}`, which can affect scrollbar behavior
3. **Nested scrollbar behavior**: The AdminLayout's `overflow-auto` container can interact unpredictably with the dialog's modal behavior

## Solution

### Fix 1: Set `modal={false}` on Select component
The Select component in CreateStaffDialog should not apply modal behavior (which removes the body scrollbar). Setting `modal={false}` ensures the scrollbar remains visible and consistent.

**File**: `src/pages/admin/staff/CreateStaffDialog.tsx`
- Change `<Select>` to `<Select modal={false}>`

### Fix 2: Reserve space for error messages
Error messages should always reserve space even when not visible, preventing layout reflow when they appear/disappear.

**File**: `src/pages/admin/staff/CreateStaffDialog.tsx`
- Add `min-h-[20px]` to FormMessage or the form field container to reserve space
- This ensures the form height remains constant whether errors are shown or not

### Fix 3: Ensure stable AdminLayout scrollbar
Although the global CSS already has `overflow-y: scroll`, ensure the AdminLayout doesn't introduce additional shifts.

**File**: `src/components/admin/AdminLayout.tsx`
- The layout is already correct (`overflow-auto` on the inner content div), but verify it doesn't conflict with dialog

### Expected Result
- Dialog remains centered and stable when clicking inputs
- No layout shift when validation errors appear
- Select dropdown opens without affecting the overall layout
- Consistent visual experience across all interactions

