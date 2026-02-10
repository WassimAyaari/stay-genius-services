

# Spa Bookings: Two-Level View (Services List then Bookings)

## Overview

Replace the current flat list of all bookings with a two-level navigation:
1. **Level 1** -- List all spa services (e.g., "Hammam & Sauna Experience", "Wellness") as rows with a "View Bookings >" button and a pending count badge
2. **Level 2** -- When clicking a service, show that service's bookings with filters and booking cards, plus a "Back" button to return to the list

This matches the pattern shown in the reference screenshot.

## Changes

### File: `src/pages/admin/spa/SpaBookingsTab.tsx` (full rewrite)

**Level 1 -- Services list view:**
- Fetch spa services from `spa_services` table
- For each service, show a card row with the service name and a "View Bookings >" link on the right
- Optionally show a badge with the count of pending bookings per service
- A "Refresh" button at the top right

**Level 2 -- Selected service bookings view:**
- Add `selectedServiceId` state (null = show list, string = show bookings)
- When a service is selected, filter bookings by `service_id === selectedServiceId`
- Show a back button/arrow at the top to return to the services list
- Show the service name as the section title
- Keep the existing search, status filter, and date filter
- Keep the existing booking cards with status management

**State flow:**
```text
selectedServiceId = null  -->  Show services list
selectedServiceId = "abc" -->  Show bookings for that service
```

**No other files need to change.** The existing `useSpaBookings` hook already fetches all bookings with service data joined, so we just filter client-side by `service_id`.

## Technical Details

- Fetch services via `supabase.from('spa_services').select('id, name, facility_id').order('name')`
- Use a simple `useState<string | null>(null)` to track selected service
- When `selectedServiceId` is null, render the services list
- When set, render existing booking cards filtered by `service_id`
- Add `ChevronRight` and `ArrowLeft` icons from lucide-react for navigation
- Pending count per service: count from `bookings.filter(b => b.service_id === svc.id && b.status === 'pending')`
