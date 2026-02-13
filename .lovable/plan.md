

# Fix: Create Staff Dialog -- Reduce Spacing and Add Scroll for Mobile

## Problem
The "Create Staff Account" dialog has excessive white space between fields due to `min-h-[20px]` reserved for error messages and `space-y-4` gaps. With the new Service Type field, it overflows on mobile and isn't responsive.

## Solution

### 1. Remove reserved error message space
Remove all `<div className="min-h-[20px]"><FormMessage /></div>` wrappers and replace with plain `<FormMessage />`. Error messages will appear only when needed instead of reserving blank space.

### 2. Reduce form spacing
Change the form's `space-y-4` to `space-y-3` for tighter field grouping.

### 3. Add scrollable content area with max height
Add `max-h-[85vh] overflow-y-auto` to the `DialogContent` so the dialog scrolls on small screens instead of overflowing.

### 4. Improve mobile responsiveness
Update the `DialogContent` className to ensure proper width and padding on small screens:
- Use `w-[95vw] sm:max-w-md` for proper mobile width
- The scroll ensures all content is accessible regardless of screen size

## File to Edit

### `src/pages/admin/staff/CreateStaffDialog.tsx`

**Changes:**
- Line 139: `DialogContent` className becomes `"w-[95vw] sm:max-w-md max-h-[85vh] overflow-y-auto"`
- Line 147: `space-y-4` becomes `space-y-3`
- Lines 171, 185, 207, 231, 245, 258: Remove the `<div className="min-h-[20px]">` wrappers, keep plain `<FormMessage />`

