

# Remove Duplicate Titles in Spa Bookings

## Problem
1. On the spa service list (Level 1), "Spa Bookings" title is redundant since the parent Card already shows "Bookings" / "Manage spa bookings and their status"
2. When viewing a specific service's bookings (Level 2), the parent "Bookings" CardHeader stays visible, duplicating context already shown by the back button and service name header

## Changes

### File: `src/pages/admin/spa/SpaBookingsTab.tsx`
- Remove the "Spa Bookings" heading (line 218) from the Level 1 view -- keep only the Refresh button aligned to the right
- Expose the `selectedServiceId` state to the parent by accepting an optional callback prop (e.g., `onServiceSelected?: (id: string | null) => void`) and calling it whenever the selection changes

### File: `src/pages/admin/SpaManager.tsx`
- Track whether a spa service is selected via a state variable (e.g., `selectedSpaService`)
- Pass a callback to `SpaBookingsTab` to update this state
- Wrap the Bookings tab's `CardHeader` in a conditional: only render it when no service is selected (`!selectedSpaService`)
- Same pattern already applied to the Restaurant Manager

## Result
- Level 1: No more duplicate "Spa Bookings" title; the Card's "Bookings" header is sufficient
- Level 2: The "Bookings" CardHeader hides, leaving only the back button and service name as the header
