
# Plan: Fix Restaurant Reservations Display in Admin Dashboard

## Problem Analysis

Two issues are preventing restaurant reservations from displaying in the admin dashboard:

### Issue 1: Missing Route
The URL `/admin/restaurants/:id` has no registered route, causing a blank page when navigating to individual restaurant pages.

### Issue 2: Query Function Selection Bug
The `useTableReservationsCore` hook selects the wrong query function. When the admin selects a restaurant in the Bookings tab, the hook still calls `fetchUserReservations` (filtering by user_id/email) instead of `fetchRestaurantReservations` (filtering by restaurant_id).

The console logs confirm this:
- Actual: "Fetching reservations for user ID: ..."
- Expected: "Fetching reservations for restaurant ID: ..."

---

## Solution

### Fix 1: Register Missing Route

**File:** `src/routes/AdminRoutes.tsx`

Add import for `RestaurantReservationsManager` and register the route.

```typescript
import RestaurantReservationsManager from '@/pages/admin/RestaurantReservationsManager';

// Add inside Routes:
<Route path="restaurants/:id/reservations" element={<RestaurantReservationsManager />} />
```

---

### Fix 2: Fix Query Function Logic

**File:** `src/hooks/reservations/useTableReservationsCore.tsx`

The issue is that `isRestaurantSpecific` is computed once, but needs to be reactive. Change the queryFn to be computed dynamically within the useQuery call:

Current (broken):
```typescript
const isRestaurantSpecific = !!restaurantId && restaurantId !== ':id';
const { fetchUserReservations, fetchRestaurantReservations } = useReservationsFetching(...);

const { data: reservations } = useQuery({
  queryKey: ['tableReservations', userId, userEmail, restaurantId],
  queryFn: isRestaurantSpecific ? fetchRestaurantReservations : fetchUserReservations,
  ...
});
```

Fixed:
```typescript
const { data: reservations } = useQuery({
  queryKey: ['tableReservations', userId, userEmail, restaurantId],
  queryFn: async () => {
    const shouldFetchByRestaurant = !!restaurantId && restaurantId !== ':id';
    if (shouldFetchByRestaurant) {
      return fetchRestaurantReservations();
    }
    return fetchUserReservations();
  },
  ...
});
```

This ensures the decision is made at query execution time, not at hook initialization time.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/routes/AdminRoutes.tsx` | Add route for `restaurants/:id/reservations` |
| `src/hooks/reservations/useTableReservationsCore.tsx` | Fix queryFn to evaluate restaurant filtering dynamically |

---

## Expected Result

After implementing these fixes:

1. **Bookings Tab**: When admin selects a restaurant, reservations for that restaurant will appear
2. **Individual Restaurant Page**: URL `/admin/restaurants/:id/reservations` will display that restaurant's reservations
3. **Status Updates**: Admin can confirm or cancel reservations

---

## Testing Steps

1. Log in as admin
2. Go to Admin Panel, then F&B, then Restaurants
3. Click on the Bookings tab
4. Select a restaurant from the dropdown (e.g., "Allegria")
5. Verify reservations appear in the grid
6. Try updating a reservation status (confirm/cancel)
