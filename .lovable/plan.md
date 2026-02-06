

# Plan: Fix Real-Time Notifications for Booking Status Updates

## Problem Analysis

When an admin confirms a spa booking, the user doesn't receive a real-time notification. After investigation, I found **two root causes**:

### Root Cause 1: Missing Realtime Publication

The Supabase realtime publication is missing key tables. Currently published:

| Table | Published |
|-------|-----------|
| `event_reservations` | Yes |
| `conversations` | Yes |
| `messages` | Yes |
| `chat_routing` | Yes |
| **`spa_bookings`** | **NO** |
| **`table_reservations`** | **NO** |
| **`service_requests`** | **NO** |

Without these tables in the realtime publication, Supabase doesn't broadcast changes to connected clients.

### Root Cause 2: No Polling Fallback

Unlike the message system (which now has a polling fallback), the notification system relies 100% on realtime subscriptions. If realtime fails for any reason, updates are missed.

---

## Solution Overview

| Step | Action |
|------|--------|
| 1 | Add missing tables to Supabase realtime publication via migration |
| 2 | Add polling fallback to useNotificationsRealtime for reliability |
| 3 | Fix the increment counter function connection |

---

## Implementation Details

### Step 1: Database Migration - Enable Realtime for Notification Tables

Create a migration to add the missing tables to the realtime publication:

```sql
-- Add notification-related tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE spa_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE table_reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
```

### Step 2: Add Polling Fallback to Notifications

Add an exponential backoff polling mechanism in `useNotificationsRealtime.ts` as a safety net:

```typescript
// Add polling fallback with exponential backoff
useEffect(() => {
  if (!userId && !userEmail && !userRoomNumber) return;
  
  let pollInterval = 5000; // Start at 5 seconds
  let timeoutId: NodeJS.Timeout | null = null;
  
  const poll = async () => {
    try {
      // Refetch all data
      await Promise.all([
        refetchReservations(),
        refetchServices(),
        refetchSpaBookings(),
        refetchEventReservations()
      ]);
      
      // Gradually increase interval (max 30 seconds)
      pollInterval = Math.min(pollInterval * 1.5, 30000);
    } catch (error) {
      console.error('Notification polling error:', error);
    } finally {
      timeoutId = setTimeout(poll, pollInterval);
    }
  };
  
  timeoutId = setTimeout(poll, pollInterval);
  
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [userId, userEmail, userRoomNumber, ...refetch functions]);
```

### Step 3: Update Realtime Handlers to Properly Increment Counter

Currently, `setHasNewNotifications(true)` calls `incrementCount()` which is correct, but we should also ensure the toast is shown. Update the handlers to be more explicit:

```typescript
// In each listener callback
(payload) => {
  console.log('Notification update received:', payload);
  
  // Increment notification count
  setHasNewNotifications(true);
  
  // Refetch the data
  refetchData();
  
  // Show toast for status updates
  handleStatusChange(payload);
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/migrations/[new].sql` | Add spa_bookings, table_reservations, service_requests to realtime publication |
| `src/hooks/notifications/useNotificationsRealtime.ts` | Add polling fallback with exponential backoff |

---

## Technical Details

### How Realtime Works

```text
Admin updates spa_booking status
        │
        ▼
PostgreSQL UPDATE executed
        │
        ▼
Supabase checks supabase_realtime publication
        │
        ├── spa_bookings NOT in publication ──► No broadcast (CURRENT)
        │
        └── spa_bookings IN publication ──► Broadcast to subscribers (AFTER FIX)
                                                     │
                                                     ▼
                                           User receives update
                                                     │
                                                     ▼
                                           incrementCount() called
                                                     │
                                                     ▼
                                           Badge shows +1
```

### Polling Fallback Flow

```text
Initial poll after 5 seconds
        │
        ▼
Refetch all notification data
        │
        ├── New data found ──► Already in state via realtime
        │                       Poll again in 7.5s (increases)
        │
        └── No new data ──► Poll again in 7.5s
                            │
                            ▼
                      Max poll interval: 30 seconds
```

---

## Expected Results After Fix

1. When admin confirms a spa booking, the user receives a realtime update immediately
2. The notification badge increments by 1
3. A toast notification appears saying "Your spa reservation has been confirmed"
4. Even if realtime fails, the polling fallback catches updates within 5-30 seconds
5. Same behavior for table reservations and service requests

