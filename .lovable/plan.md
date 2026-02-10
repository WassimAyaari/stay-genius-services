

# Replace Technical Booking IDs with Guest Names

## Problem

The booking cards show "Booking #9f07620e" which is a truncated database UUID -- meaningless to the admin.

## Solution

Replace the card title with the guest's name, which is immediately recognizable and useful.

**Before:** `Booking #9f07620e`
**After:** `emna jemal`

## Change

### File: `src/pages/admin/spa/SpaBookingsTab.tsx`

In the `renderBookingCard` function, change the CardTitle from:

```tsx
<CardTitle className="text-lg">Booking #{booking.id.substring(0, 8)}</CardTitle>
```

To:

```tsx
<CardTitle className="text-lg">{booking.guest_name}</CardTitle>
```

That is the only change needed. The guest name is already available on every booking object.

