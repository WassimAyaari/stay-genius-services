

# Plan: Fix Notification Badge Not Incrementing on Admin Status Updates

## Problem Identified

When an admin confirms a restaurant booking, the user's notification badge doesn't increment. Based on my investigation, I found **two root causes**:

### Root Cause 1: Unstable Callback Reference

The `setHasNewNotifications` function in `useNotificationsState.ts` is **not memoized with `useCallback`**:

```typescript
// Current (PROBLEMATIC)
setHasNewNotifications: (value: boolean) => {
  if (value) incrementCount();
  else markAsSeen();
}
```

This creates a new function reference on every render. Since this function is passed to `useNotificationsRealtime` and included in its dependency array, the realtime subscriptions are constantly being torn down and recreated. During this churn, updates may be missed.

### Root Cause 2: Polling Fallback Doesn't Increment Badge

The polling fallback only refetches data but doesn't detect status changes to increment the notification counter. It should compare the `updated_at` timestamps to detect changes that occurred since last poll.

---

## Solution Overview

| Step | Action |
|------|--------|
| 1 | Memoize `setHasNewNotifications` with `useCallback` in `useNotificationsState.ts` |
| 2 | Pass `incrementCount` directly instead of `setHasNewNotifications` for clearer intent |
| 3 | Update polling fallback to detect new updates and increment counter |

---

## File Changes

### 1. Fix `useNotificationsState.ts` - Memoize the callback

```typescript
import { useState, useCallback } from 'react';

const STORAGE_KEY = 'lastSeenNotificationsAt';

export const useNotificationsState = () => {
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [lastSeenAt, setLastSeenAt] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || new Date(0).toISOString();
  });

  const incrementCount = useCallback(() => {
    setNewNotificationCount(prev => prev + 1);
  }, []);

  const markAsSeen = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, now);
    setLastSeenAt(now);
    setNewNotificationCount(0);
  }, []);

  // FIXED: Memoize with useCallback
  const setHasNewNotifications = useCallback((value: boolean) => {
    if (value) {
      setNewNotificationCount(prev => prev + 1);
    } else {
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, now);
      setLastSeenAt(now);
      setNewNotificationCount(0);
    }
  }, []);

  return {
    newNotificationCount,
    lastSeenAt,
    incrementCount,
    markAsSeen,
    hasNewNotifications: newNotificationCount > 0,
    setHasNewNotifications
  };
};
```

### 2. Update `useNotificationsRealtime.ts` - Add better logging and ensure handlers work

Add more detailed logging to diagnose if the realtime events are being received:

```typescript
// In each handler callback
(payload) => {
  console.log('[NOTIFICATION REALTIME] Reservation update received:', {
    eventType: payload.eventType,
    oldStatus: payload.old?.status,
    newStatus: payload.new?.status,
    userId: payload.new?.user_id
  });
  
  setHasNewNotifications(true);
  refetchReservations();
  handleReservationStatusChange(payload);
}
```

### 3. Update Polling to Detect Status Changes

Modify the polling fallback to track last poll timestamp and detect if any items were updated:

```typescript
useEffect(() => {
  if (!userId && !userEmail && !userRoomNumber) return;
  
  let pollInterval = 5000;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isMounted = true;
  let lastPollTimestamp = new Date().toISOString();
  
  const checkForUpdates = async () => {
    try {
      // Check for reservation updates since last poll
      const { count: reservationUpdates } = await supabase
        .from('table_reservations')
        .select('*', { count: 'exact', head: true })
        .or(`user_id.eq.${userId},guest_email.eq.${userEmail}`)
        .gt('updated_at', lastPollTimestamp)
        .neq('status', 'pending'); // Only count status changes
      
      if (reservationUpdates && reservationUpdates > 0) {
        setHasNewNotifications(true);
      }
      
      // Similar checks for spa_bookings, service_requests, event_reservations
      
      lastPollTimestamp = new Date().toISOString();
    } catch (error) {
      console.error('Polling check error:', error);
    }
  };
  
  const poll = async () => {
    if (!isMounted) return;
    
    await checkForUpdates();
    await refetchAll();
    
    pollInterval = Math.min(pollInterval * 1.5, 30000);
    
    if (isMounted) {
      timeoutId = setTimeout(poll, pollInterval);
    }
  };
  
  timeoutId = setTimeout(poll, pollInterval);
  
  return () => {
    isMounted = false;
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [userId, userEmail, userRoomNumber, ...]);
```

---

## Data Flow After Fix

```text
Admin confirms reservation
         |
         v
Supabase UPDATE executed
         |
         v
Realtime broadcast (table_reservations)
         |
         v
User's subscription receives event
         |
         v
setHasNewNotifications(true) called
         |
         v
setNewNotificationCount(prev => prev + 1)
         |
         v
Badge shows: 1

---

If Realtime fails, Polling catches it:
         |
         v
Poll detects updated_at > lastPollTimestamp
         |
         v
setHasNewNotifications(true) called
         |
         v
Badge increments
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/hooks/notifications/useNotificationsState.ts` | Memoize `setHasNewNotifications` with `useCallback` to prevent subscription churn |
| `src/hooks/notifications/useNotificationsRealtime.ts` | Add enhanced logging + update polling to detect status changes |

---

## Expected Results

After implementation:
1. Realtime subscriptions remain stable (no constant re-subscription)
2. When admin confirms a booking, the realtime event is received and badge increments
3. Toast notification shows "Your table reservation has been confirmed"
4. Even if realtime fails, polling will catch the update and increment the badge
5. Opening the notification dropdown still resets the badge to 0

