

# Move Refresh Button to CardHeader

## Problem
The "Refresh" button sits inside `SpaBookingsTab` on its own row, creating a large visual gap between the "Bookings" title and the spa service list.

## Fix

### File: `src/pages/admin/SpaManager.tsx`
- Modify the Bookings `CardHeader` to use a flex row layout with the title/description on the left and a "Refresh" button on the right
- The Refresh button calls `refreshSpaData()` (already defined in this component)

### File: `src/pages/admin/spa/SpaBookingsTab.tsx`
- Remove the "Refresh" button and its wrapping `<div className="flex justify-end mb-6">` block from the Level 1 (service list) view (around lines 219-230)
- The service list cards will render directly without the extra gap

## Result
The "Bookings" title, description, and Refresh button all appear on one row in the CardHeader. The spa service list follows immediately below with no wasted space.

