
# Convert Restaurant Reservations from Cards to Table View

## Overview
Replace the card grid layout on the per-restaurant reservations page (`/admin/restaurants/:id/reservations`) with a data table matching the style of the "Bookings" tab at `/admin/restaurants`.

## Changes

### File: `src/pages/admin/RestaurantReservationsManager.tsx`
- Remove the `ReservationList` component usage (lines 142-145)
- Replace it with a `<Table>` using the same structure as `RestaurantBookingsTab.tsx`:
  - Columns: **Client**, **Date**, **Heure**, **Couverts**, **Statut**, **Actions**
  - No "Restaurant" column needed since this page is already filtered to one restaurant
  - Client column: guest name with room number below it, contact info in a tooltip (same pattern as the Bookings tab), special requests shown via a message icon tooltip
  - Status column: colored Badge (green/yellow/red)
  - Actions column: "Modifier" ghost button
- Import `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` from UI components
- Import `Badge`, `Tooltip`/`TooltipProvider`/`TooltipContent`/`TooltipTrigger` components
- Import `Mail`, `Phone`, `Home`, `MessageSquare` icons
- Remove import of `ReservationList`
- Also remove the force-refresh `useEffect` on lines 95-98 (same optimization applied to `RestaurantManager`)

### File: `src/components/admin/reservations/ReservationList.tsx`
- No changes needed -- it remains available for any other consumers, but will no longer be used by this page.

## Result
The per-restaurant reservation view will display a compact, scannable table identical in style to the global Bookings tab, with tooltips for contact details and special requests.
