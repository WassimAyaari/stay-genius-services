

# Show Restaurant Reservations Inline (Keep Title and Tabs Visible)

## Overview
Instead of navigating to a separate page (`/admin/restaurants/:id/reservations`) when clicking on a restaurant's reservations, the reservations will be displayed inline below the restaurant table on the same page. The page title "Restaurant Management" and the Restaurants/Bookings/Menus tab bar will remain visible at all times.

## Changes

### File: `src/pages/admin/RestaurantManager.tsx`
- Add a new state `selectedRestaurantForReservations` to track which restaurant's reservations to display inline
- Change `navigateToReservations` from a route navigation to setting this state
- When a restaurant is selected, render an inline reservations panel below the restaurant table (inside the same "Restaurants" tab content)
- The inline panel will include:
  - A header row with the restaurant name, a "Back" / close button, and a Refresh button
  - The reservation table (reusing the same table markup from `RestaurantReservationsManager`)
  - The StatusDialog for editing reservation status
- Import `useTableReservations` hook and necessary table/tooltip/badge components
- Import icons: `ArrowLeft`, `MessageSquare`, `Mail`, `Phone`, `Home`

### File: `src/pages/admin/RestaurantReservationsManager.tsx`
- No changes needed -- it stays as a fallback for direct URL access

## Result
When you click "View Reservations" on any restaurant, the reservations table slides in below the restaurant list without leaving the page. The title, subtitle, and tab navigation all remain visible and accessible.

