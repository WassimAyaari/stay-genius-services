
# Plan: Redirect Notifications Menu to /requests

## Problem
When clicking "Notifications" in the main menu, it navigates to `/notifications` which displays the Profile page (due to route configuration). You want it to go directly to `/requests` where the "My Requests" page is displayed.

## Solution

Change the path for the Notifications menu item from `/notifications` to `/requests`.

## File to Modify

| File | Change |
|------|--------|
| `src/components/MainMenu.tsx` | Change Notifications path from `/notifications` to `/requests` |

## Change Details

**Line 30 in `src/components/MainMenu.tsx`:**

From:
```tsx
{ icon: <BellRing className="h-5 w-5" />, label: t('nav.notifications'), path: '/notifications' },
```

To:
```tsx
{ icon: <BellRing className="h-5 w-5" />, label: t('nav.notifications'), path: '/requests' },
```

## Expected Result

After this change:
1. Clicking "Notifications" in the side menu will navigate to `/requests`
2. The "My Requests" page will display showing all service requests, spa bookings, dining reservations, and event bookings
3. Users can see and track all their notifications/requests in one place
