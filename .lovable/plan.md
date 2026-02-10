

# Plan: Move Badge Clearing from Route Change to Tab Click

## Problem

Currently, notification badges in the sidebar disappear as soon as the admin navigates to a page (e.g., visiting `/admin/information-technology` immediately clears the IT badge). The user wants badges to persist until the admin actually opens the "Requests"/"Bookings"/"Reservations" tab within the page.

## Changes

### 1. `src/hooks/admin/useAdminNotifications.ts` -- Remove auto-mark on route change

Remove the `useEffect` (lines 136-144) that auto-calls `markSeen` when the route changes. Also remove `useLocation` import since it won't be needed. Export `markSeen` so pages can call it manually.

### 2. `src/pages/admin/InformationTechnologyManager.tsx` -- Clear badge on "Requests" tab click

- Import `useAdminNotifications`
- Convert `Tabs` from uncontrolled (`defaultValue`) to controlled (`value`/`onValueChange`)
- When tab changes to `"requests"`, call `markSeen('information-technology')`

### 3. `src/pages/admin/HousekeepingManager.tsx` -- Same pattern

- Import `useAdminNotifications`
- On tab change to `"requests"`, call `markSeen('housekeeping')`

### 4. `src/pages/admin/MaintenanceManager.tsx` -- Same pattern

- Import `useAdminNotifications`
- On tab change to `"requests"`, call `markSeen('maintenance')`

### 5. `src/pages/admin/SecurityManager.tsx` -- Same pattern

- Import `useAdminNotifications`
- On tab change to `"requests"`, call `markSeen('security')`

### 6. `src/pages/admin/RestaurantManager.tsx` -- Clear badge on "Bookings" tab click

- Import `useAdminNotifications`
- On tab change to `"bookings"`, call `markSeen('restaurants')`

### 7. `src/pages/admin/SpaManager.tsx` -- Clear badge on "Bookings" tab click

- Import `useAdminNotifications`
- On tab change to `"bookings"`, call `markSeen('spa')`

### 8. `src/pages/admin/EventsManager.tsx` -- Clear badge on "Reservations" tab click

- Import `useAdminNotifications`
- On tab change to `"reservations"`, call `markSeen('events')`

## Summary

- **1 hook modified** -- remove auto-clear on route change
- **7 page components modified** -- add controlled tabs with `markSeen` on relevant tab selection
- Badges stay visible in sidebar until the admin explicitly opens the requests/bookings tab

