
# Plan: Redirect All Notifications to /requests

## Overview
Change the notification click behavior so that clicking on any notification redirects the user to the `/requests` page instead of individual detail pages.

## Current Behavior
The `NotificationItem` component uses a `getDirectLink()` function that returns different routes based on notification type:
- `spa_booking` → `/spa/booking/${id}`
- `reservation` → `/dining/reservations/${id}`
- `request` → `/my-room/requests/${id}`
- `event_reservation` → `/events/${id}`
- default → link prop or `/notifications`

## Implementation

### File to Modify
`src/components/notifications/NotificationItem.tsx`

### Change
Update the `getDirectLink()` function to always return `/requests`:

```typescript
// Before (lines 31-44)
function getDirectLink() {
  switch (type) {
    case 'spa_booking': 
      return `/spa/booking/${id}`;
    case 'reservation': 
      return `/dining/reservations/${id}`;
    case 'request': 
      return `/my-room/requests/${id}`;
    case 'event_reservation':
      return `/events/${id}`;
    default: 
      return link || '/notifications';
  }
}

// After
function getDirectLink() {
  return '/requests';
}
```

## Result
After this change, clicking on any notification in the notification menu will navigate the user to the `/requests` page where they can see all their service requests with filtering and search capabilities.
