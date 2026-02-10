

# Plan: Per-Restaurant Notification Badges and Proper Badge Clearing

## Problem

1. The sidebar badge next to "Restaurants" shows a count, but it does not disappear when opening a specific restaurant's reservations page (`/admin/restaurants/:id/reservations`)
2. No notification appears next to individual restaurant names in the restaurant table to show which restaurant has new pending reservations
3. The badge only clears when clicking the "Bookings" tab in RestaurantManager, but not when viewing reservations via the per-restaurant route

## Solution

### 1. Track per-restaurant reservation counts

Extend `useAdminNotifications` to also fetch per-restaurant pending reservation counts, so we know which restaurants have new reservations.

**File: `src/hooks/admin/useAdminNotifications.ts`**
- Add a new query that fetches pending reservation counts grouped by `restaurant_id` (only those created after the restaurants lastSeen timestamp)
- Expose a `restaurantCounts: Record<string, number>` mapping restaurant IDs to their pending count
- Keep the existing global `restaurants` count for the sidebar badge

### 2. Show badges next to restaurant names in the table

**File: `src/components/admin/restaurants/RestaurantTable.tsx`**
- Import `useAdminNotifications`
- Read `restaurantCounts` from the hook
- Next to each restaurant name, display a small red badge showing the count of pending reservations for that specific restaurant (if > 0)

### 3. Clear badge when opening restaurant reservations page

**File: `src/pages/admin/RestaurantReservationsManager.tsx`**
- Import `useAdminNotifications`
- Call `markSeen('restaurants')` on mount so the sidebar badge clears when viewing reservations for any restaurant

### 4. Also clear from RestaurantManager bookings tab (already done)

The existing `markSeen('restaurants')` call on the "Bookings" tab in `RestaurantManager.tsx` remains unchanged.

## Technical Details

### Changes to `useAdminNotifications.ts`

Add to `fetchCounts` (or a parallel query):
```typescript
// Fetch per-restaurant pending counts
const { data: restaurantReservations } = await supabase
  .from('table_reservations')
  .select('restaurant_id')
  .eq('status', 'pending')
  .gt('created_at', restaurantLastSeen);

const restaurantCounts: Record<string, number> = {};
if (restaurantReservations) {
  for (const r of restaurantReservations) {
    if (r.restaurant_id) {
      restaurantCounts[r.restaurant_id] = (restaurantCounts[r.restaurant_id] || 0) + 1;
    }
  }
}
```

Return `restaurantCounts` alongside `counts`.

### Changes to `RestaurantTable.tsx`

Next to the restaurant name cell:
```tsx
<TableCell className="font-medium">
  <div className="flex items-center gap-2">
    {restaurant.name}
    {restaurantCounts[restaurant.id] > 0 && (
      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-medium px-1">
        {restaurantCounts[restaurant.id]}
      </span>
    )}
  </div>
</TableCell>
```

### Changes to `RestaurantReservationsManager.tsx`

Add at the top of the component:
```typescript
const { markSeen } = useAdminNotifications();

useEffect(() => {
  markSeen('restaurants');
}, []);
```

## Files Modified

| File | Change |
|------|--------|
| `src/hooks/admin/useAdminNotifications.ts` | Add per-restaurant counts to returned data |
| `src/components/admin/restaurants/RestaurantTable.tsx` | Show red badge next to restaurant names with pending reservations |
| `src/pages/admin/RestaurantReservationsManager.tsx` | Call `markSeen('restaurants')` on mount to clear sidebar badge |
