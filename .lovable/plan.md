
# Plan: Display All Notifications in the Requests Page

## Problem Summary

The "My Requests" page (`/requests`) only displays items from the `service_requests` table using `useServiceRequests()`. However, the notification dropdown shows data from **four sources**:

| Source | Table | Currently Shown |
|--------|-------|-----------------|
| Service Requests | `service_requests` | Yes (in Requests page) |
| Spa Bookings | `spa_bookings` | No |
| Table Reservations | `table_reservations` | No |
| Event Reservations | `event_reservations` | No |

Your screenshot shows 5 notifications (3 Spa Reservations + 1 Event Reservation), but the Requests page shows 0 because it only queries `service_requests`.

---

## Solution

Update the Requests page to use `useNotifications()` instead of `useServiceRequests()`. This will display all types of notifications (spa bookings, table reservations, event reservations, and service requests) in one unified list.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/requests/Requests.tsx` | Replace `useServiceRequests()` with `useNotifications()` and display all notification types |

---

## Implementation Details

### Step 1: Change Data Source

Replace the `useServiceRequests` import with `useNotifications`:

```typescript
// Before
import { useServiceRequests } from '@/hooks/useServiceRequests';
const { data: requests = [], ... } = useServiceRequests();

// After
import { useNotifications } from '@/hooks/useNotifications';
const { notifications, refetchServices, refetchReservations, refetchSpaBookings, refetchEventReservations } = useNotifications();
```

### Step 2: Update Search/Filter Logic

The search and filter will work on the unified `notifications` array instead of just service requests. Each notification already has:
- `type`: 'request', 'spa_booking', 'reservation', 'event_reservation'
- `title`: 'Spa Reservation', 'Event Reservation', etc.
- `description`: Details about the booking
- `status`: 'pending', 'confirmed', 'completed', 'cancelled'
- `time`: Creation date

### Step 3: Display Different Notification Types

Each card will show the appropriate icon and title based on notification type:

| Type | Icon | Title |
|------|------|-------|
| request | FileText | Service Request |
| spa_booking | Sparkles | Spa Reservation |
| reservation | UtensilsCrossed | Restaurant Reservation |
| event_reservation | Calendar | Event Reservation |

### Step 4: Handle Cancel Actions

Different types have different cancel functions:
- Service requests: `cancelRequest()` from `useServiceRequests`
- Spa bookings: Cancel via `useSpaBookings`
- Table reservations: Cancel via `useTableReservations`
- Event reservations: Cancel via `useEventReservations`

### Step 5: Add Type Filter

Add a new filter option to filter by notification type (All Types, Service Requests, Spa Bookings, etc.).

---

## Visual Change

**Before:**
```
My Requests
Showing 0 of 0 requests
[Empty state: "No requests yet"]
```

**After:**
```
My Requests
Showing 5 of 5 requests
+-----------------------------------+
| Spa Reservation        [Completed]|
| Booking for 2026-02-06 at 09:00  |
+-----------------------------------+
| Spa Reservation         [Pending] |
| Booking for 2026-02-06 at 12:00  |
+-----------------------------------+
| Spa Reservation         [Pending] |
| Booking for 2026-02-06 at 16:00  |
+-----------------------------------+
| Event Reservation      [Confirmed]|
| 2026-02-10 - 2 guests            |
+-----------------------------------+
```

---

## Expected Result

After this change:
1. The Requests page will show all 5 notifications visible in the dropdown
2. Users can filter by type (Spa, Event, Dining, Service)
3. Users can filter by status (Pending, Confirmed, Completed, Cancelled)
4. Users can search across all notification types
5. The "Cancel" button will work for applicable notification types
