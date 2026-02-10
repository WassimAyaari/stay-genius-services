

# Fix Admin Notifications: Persistent, Status-Based System

## Problem

The current admin notification system uses `localStorage` timestamps (`admin_lastSeen_*`) to track which items are "new." But `localStorage.clear()` is called on logout (in `UserMenu.tsx`), which wipes these timestamps. On next login, the fallback date becomes `1970-01-01`, so **all pending items** appear as new notifications again -- and the counts vary because they depend on how many pending items exist in each section at that moment.

## Solution

Replace the timestamp-based tracking with a simple **status-based** system:

- A notification badge shows the count of items with `status = 'pending'`
- Once an admin processes an item (confirms, cancels, or completes it), the badge count drops
- No localStorage timestamps needed -- the badge reflects real pending work, not "new since last visit"
- Logout/login has zero effect on badge counts

This is more intuitive: the badge means "items that need attention," not "items you haven't looked at."

## Changes

### File: `src/hooks/admin/useAdminNotifications.ts`

Simplify the `fetchCounts` function:

- **Remove** `getLastSeen()` and `setLastSeen()` functions entirely
- **Remove** all `.gt('created_at', lastSeen)` filters from queries
- Keep only `.eq('status', 'pending')` filters -- count all pending items regardless of when they were created
- **Remove** the `markSeen` callback (no longer needed)
- Keep real-time subscriptions and polling as-is, but also listen for `UPDATE` events (status changes) in addition to `INSERT`

The simplified query pattern:

```
// Before (broken by logout)
.eq('status', 'pending')
.gt('created_at', getLastSeen('restaurants'))

// After (always accurate)
.eq('status', 'pending')
```

### File: `src/components/admin/AdminSidebar.tsx`

- Remove the `markSeen` destructuring (no longer exported)
- No other changes needed -- it already reads `counts` which will now be purely status-based

### Files calling `markSeen` (6 files)

Remove all `markSeen` calls from:
- `src/pages/admin/RestaurantManager.tsx`
- `src/pages/admin/SpaManager.tsx`
- `src/pages/admin/EventsManager.tsx`
- `src/pages/admin/HousekeepingManager.tsx`
- `src/pages/admin/MaintenanceManager.tsx`
- `src/pages/admin/SecurityManager.tsx`
- `src/pages/admin/InformationTechnologyManager.tsx`
- `src/pages/admin/RestaurantReservationsManager.tsx`

These pages will no longer need to call `markSeen` because the badge clears automatically when the admin changes the item's status.

## What This Means for the User

- Badge shows "7" on Spa? That means there are 7 pending spa bookings that haven't been confirmed or cancelled yet
- Admin confirms 3 of them? Badge drops to "4" automatically
- Admin logs out and back in? Badge still shows "4" -- no reset
- New booking comes in? Badge goes to "5" via real-time subscription

## Summary

| File | Change |
|------|--------|
| `src/hooks/admin/useAdminNotifications.ts` | Remove localStorage timestamps, use pure status-based counts, add UPDATE listener |
| `src/components/admin/AdminSidebar.tsx` | Remove markSeen usage |
| 7 admin manager pages | Remove markSeen calls |
| `src/components/admin/restaurants/RestaurantTable.tsx` | No change (restaurantCounts still works) |

