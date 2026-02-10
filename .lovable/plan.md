

# Fix Restaurant Reservations Page Layout

## Problem

The `RestaurantReservationsManager` page uses a different layout (`p-6 max-w-7xl mx-auto`) compared to other admin pages (which use `p-6` without max-width constraints). It also wraps everything in an extra `Card > CardContent`, adding unnecessary padding and a border that pushes content inward. This makes it look inconsistent with the rest of the admin panel.

## Changes

### File: `src/pages/admin/RestaurantReservationsManager.tsx`

1. **Remove `max-w-7xl mx-auto`** from the outer wrapper -- change `p-6 max-w-7xl mx-auto` to just `p-6` to match other admin pages
2. **Remove the `Card` and `CardContent` wrapper** around the reservation list -- render the `ReservationList` directly without the card container, so the reservation cards sit flush at the top level like other admin page content
3. Keep the header (Back button, title, Refresh) and the loading/empty states as they are, just without the card wrapper

### Result

The page will match the standard admin layout pattern: a header section with title and actions, followed by the content directly below -- no extra card nesting or constrained width.

