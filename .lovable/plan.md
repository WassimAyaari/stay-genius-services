
# Hide Card Header When Viewing Reservations

## Problem
When clicking on a restaurant's reservations, the `CardHeader` (with "Restaurants" title, description, Refresh and Add Restaurant buttons) remains visible above the inline reservations panel. This is redundant since the reservations panel has its own header with a back button and refresh.

## Fix

### File: `src/pages/admin/RestaurantManager.tsx`
- Wrap the `<CardHeader>` block (lines 126-146) in a conditional so it only renders when `selectedRestaurantForReservations` is `null`
- When a restaurant's reservations are being viewed, the Card will skip straight to `<CardContent>` with the inline reservations panel

```tsx
{!selectedRestaurantForReservations && (
  <CardHeader>
    <CardTitle>Restaurants</CardTitle>
    <CardDescription>...</CardDescription>
    <div className="flex gap-2">
      <Button>Refresh</Button>
      <Button>Add Restaurant</Button>
    </div>
  </CardHeader>
)}
```

This is a single conditional wrapper -- no other changes needed.
