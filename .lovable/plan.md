

# Replace Reservation Cards with a Data Table

## Overview

Switch the Bookings tab from a grid of cards to a clean, compact **data table** layout. This is more suited for admin use -- easier to scan, sort visually, and manage many reservations at once.

## Changes

### File: `src/pages/admin/restaurants/RestaurantBookingsTab.tsx`

Replace the `ReservationList` card grid with an inline data table using the existing Shadcn `Table` components. The table will have these columns:

| Column | Content |
|--------|---------|
| Guest | Name + room number |
| Restaurant | Restaurant name (from restaurantMap) |
| Date | Formatted date |
| Time | Time slot |
| Guests | Number of guests |
| Status | Color-coded badge (pending/confirmed/cancelled) |
| Actions | "Modifier le statut" button |

- The filters (restaurant dropdown, status dropdown) and refresh button stay exactly as they are at the top
- The `StatusDialog` remains unchanged
- Contact info (email, phone) and special requests will be visible via a collapsible row or tooltip to keep the table clean
- Empty and loading states remain the same

### No new files needed

The `ReservationList` and `ReservationCard` components are no longer used by this tab (they may still be used elsewhere, so they won't be deleted).

### Technical Details

The table will be built directly in `RestaurantBookingsTab.tsx` using:
- `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` from `@/components/ui/table`
- Status badges using the same color scheme (green for confirmed, yellow for pending, red for cancelled)
- `format(new Date(date), 'dd MMM yyyy', { locale: fr })` for date formatting
- A small icon button or text button in the Actions column to open the status dialog
- Special requests shown as a tooltip icon (MessageSquare) when present
- Contact info (email/phone) shown as a tooltip on hover over the guest name

