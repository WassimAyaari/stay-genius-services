

# Plan: Show All Restaurant Reservations in the Bookings Tab

## Problem

The Bookings tab currently requires selecting a restaurant from a dropdown before showing any reservations. The user wants to see all reservations from all restaurants in one unified, user-friendly list.

## Changes

### File: `src/pages/admin/restaurants/RestaurantBookingsTab.tsx`

Complete rework of this component:

1. **Fetch all reservations without a restaurant filter** -- call `useTableReservations()` with no `restaurantId` argument. However, this currently fetches user-specific reservations, not all. So we need a different approach:
   - Query `table_reservations` directly with Supabase, fetching ALL reservations ordered by date descending
   - Join with restaurant names so each reservation shows which restaurant it belongs to

2. **Display a unified table/grid** showing:
   - Restaurant name (looked up from the restaurants list)
   - Guest name
   - Date and time
   - Number of guests
   - Status badge (pending/confirmed/cancelled)
   - Action button to change status

3. **Add filter controls at the top**:
   - Optional restaurant filter dropdown (still available, but defaults to "All restaurants")
   - Optional status filter (All / Pending / Confirmed / Cancelled)

4. **Keep the StatusDialog** for updating reservation status

### File: `src/hooks/useAllTableReservations.ts` (new file)

Create a new hook that fetches all table reservations across all restaurants (for admin use):
- Query `table_reservations` ordered by `created_at desc`
- No restaurant filter by default, but accept optional filters
- Include real-time subscription for updates
- Use the existing `updateReservationStatus` mutation pattern

### Implementation Details

The new Bookings tab will:
- On load, fetch all reservations across restaurants using a single Supabase query
- Look up restaurant names from the `useRestaurants` hook
- Display reservations in the existing `ReservationCard` grid, but with the restaurant name shown on each card
- Optionally filter by restaurant or status using dropdowns at the top
- Include a refresh button

### File: `src/components/admin/reservations/ReservationCard.tsx`

- Add an optional `restaurantName` prop
- Display it at the top of the card when provided (e.g., as a subtitle or tag)

### Summary

| File | Change |
|------|--------|
| `src/hooks/useAllTableReservations.ts` | New hook to fetch all reservations for admin |
| `src/pages/admin/restaurants/RestaurantBookingsTab.tsx` | Rework to show all reservations with optional filters |
| `src/components/admin/reservations/ReservationCard.tsx` | Add optional `restaurantName` display |

