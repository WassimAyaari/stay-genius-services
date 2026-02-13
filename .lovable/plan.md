
## Problem
When the "Assign To" dropdown is clicked, the table shifts slightly. This is caused by:

1. **Actions cell layout**: The `flex-wrap` class allows buttons to wrap when space is limited, and the dropdown's Portal rendering can affect available space in the viewport
2. **No fixed width**: The Actions cell doesn't have a fixed or minimum width, so it compresses when the dropdown opens

## Solution
The fix involves ensuring the Actions cell maintains stable width and the dropdown doesn't cause layout reflow:

### Option 1: Use `flex-nowrap` (Recommended)
Change the Actions cell container from `flex-wrap` to `flex-nowrap` and ensure buttons don't wrap:
- Line 131 in HousekeepingRequestsTab.tsx: Change `className="flex gap-2 flex-wrap"` to `className="flex gap-2 flex-nowrap"`
- This prevents buttons from wrapping and maintains consistent cell width
- Apply same change to all other service request tabs (Maintenance, Security, IT Support)

### Option 2: Set fixed min-width on Actions cell
If wrapping is desired for mobile, add `min-w-[200px]` or similar to the TableCell containing actions to reserve space

## Files to Modify
1. `src/pages/admin/housekeeping/components/HousekeepingRequestsTab.tsx` (Line 131)
2. `src/pages/admin/maintenance/components/MaintenanceRequestsTab.tsx` (similar line)
3. `src/pages/admin/security/SecurityRequestsTab.tsx` (similar line)
4. `src/pages/admin/information-technology/components/InformationTechnologyRequestsTab.tsx` (similar line)

## Implementation
Change `flex-wrap` to `flex-nowrap` in the actions container for all request tabs to prevent button wrapping and ensure the table layout remains stable when the dropdown opens.
