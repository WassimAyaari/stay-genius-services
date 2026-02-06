

# Plan: Implement Smart Notification Badge System

## Overview

This plan implements a proper notification badge system with two key behaviors:
1. **Request/Booking Notifications**: Badge resets to 0 when the notification dropdown is opened
2. **Message Notifications**: Badge increments when staff replies and resets when Messages page is opened

---

## Current State Analysis

| Component | Current Behavior | Issue |
|-----------|------------------|-------|
| Notification dropdown | Badge shows count of "pending/in_progress/confirmed" items | Doesn't track when user last viewed notifications |
| Messages icon in BottomNav | Hardcoded badge showing "2" | Not connected to real unread message count |
| Realtime updates | Sets `hasNewNotifications: true` on changes | Counter doesn't increment, just flags "new available" |

---

## Solution Architecture

Create a local storage-based "last seen" tracking system for both notification types:

```text
Notification Badge Logic
-------------------------

User opens dropdown
       |
       v
Save current timestamp as "lastSeenNotificationsAt"
       |
       v
Badge count = notifications created AFTER lastSeenNotificationsAt

---

Message Badge Logic  
-------------------

Staff sends message
       |
       v
Message is stored with created_at timestamp
       |
       v
Badge count = messages from staff AFTER lastSeenMessagesAt

User opens Messages page
       |
       v
Save current timestamp as "lastSeenMessagesAt"
       |
       v
Badge resets to 0
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/useNotificationBadge.ts` | Track "last seen" timestamp for notifications and calculate unread count |
| `src/hooks/useMessageBadge.ts` | Track "last seen" timestamp for messages and calculate unread count |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/hooks/notifications/useNotificationsState.ts` | Add lastSeenAt tracking and new notification count based on timestamp |
| `src/hooks/useNotifications.ts` | Use timestamp-based unread counting |
| `src/components/NotificationMenu.tsx` | Update lastSeenAt when dropdown opens |
| `src/components/BottomNav.tsx` | Use real unread message count from new hook |
| `src/pages/messages/Messages.tsx` | Reset message badge when page loads |
| `src/hooks/notifications/useNotificationsRealtime.ts` | Increment counter instead of just flagging |

---

## Technical Implementation Details

### Step 1: Create useNotificationBadge hook

This hook will:
- Store `lastSeenNotificationsAt` timestamp in localStorage
- Calculate unread count as notifications created after that timestamp
- Provide a function to mark notifications as "seen" (updates timestamp)

```typescript
// src/hooks/useNotificationBadge.ts
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lastSeenNotificationsAt';

export const useNotificationBadge = () => {
  const [lastSeenAt, setLastSeenAt] = useState<Date>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Date(stored) : new Date(0); // Epoch if never seen
  });

  const markAsSeen = useCallback(() => {
    const now = new Date();
    localStorage.setItem(STORAGE_KEY, now.toISOString());
    setLastSeenAt(now);
  }, []);

  const getUnseenCount = useCallback((notifications: { time: Date }[]) => {
    return notifications.filter(n => n.time > lastSeenAt).length;
  }, [lastSeenAt]);

  return { lastSeenAt, markAsSeen, getUnseenCount };
};
```

### Step 2: Create useMessageBadge hook

This hook will:
- Store `lastSeenMessagesAt` timestamp in localStorage
- Query for messages from staff/AI after that timestamp
- Provide real-time updates via Supabase subscription

```typescript
// src/hooks/useMessageBadge.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'lastSeenMessagesAt';

export const useMessageBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastSeenAt, setLastSeenAt] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || new Date(0).toISOString();
  });

  // Fetch unread message count
  const fetchUnreadCount = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get conversations for this user
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .eq('guest_id', user.id);

    if (!conversations?.length) {
      setUnreadCount(0);
      return;
    }

    // Count messages from staff/AI after lastSeenAt
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .in('conversation_id', conversations.map(c => c.id))
      .in('sender_type', ['staff', 'ai'])
      .gt('created_at', lastSeenAt);

    setUnreadCount(count || 0);
  }, [lastSeenAt]);

  // Mark messages as seen
  const markAsSeen = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, now);
    setLastSeenAt(now);
    setUnreadCount(0);
  }, []);

  // Initial fetch and realtime subscription
  useEffect(() => {
    fetchUnreadCount();

    // Subscribe to new messages
    const channel = supabase
      .channel('message-badge-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        if (payload.new.sender_type === 'staff' || payload.new.sender_type === 'ai') {
          setUnreadCount(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUnreadCount]);

  return { unreadCount, markAsSeen, refetch: fetchUnreadCount };
};
```

### Step 3: Update useNotificationsState

Add counter-based tracking that increments on new notifications:

```typescript
// src/hooks/notifications/useNotificationsState.ts
import { useState, useCallback, useEffect } from 'react';

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

  return {
    newNotificationCount,
    lastSeenAt,
    incrementCount,
    markAsSeen,
    // Legacy support
    hasNewNotifications: newNotificationCount > 0,
    setHasNewNotifications: (value: boolean) => {
      if (value) incrementCount();
      else markAsSeen();
    }
  };
};
```

### Step 4: Update NotificationMenu

Call `markAsSeen` when dropdown opens:

```typescript
// In handleOpenChange callback
const handleOpenChange = useCallback((open: boolean) => {
  if (open) {
    markAsSeen(); // Reset badge to 0
    // ... existing refresh logic
  }
}, [markAsSeen, ...]);
```

### Step 5: Update BottomNav

Replace hardcoded "2" with real unread count:

```typescript
// Import and use the hook
import { useMessageBadge } from '@/hooks/useMessageBadge';

const BottomNav = () => {
  const { unreadCount } = useMessageBadge();
  
  // In navItems
  {
    icon: (
      <div className="relative">
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[8px] text-white flex items-center justify-center font-medium border border-card">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
    ),
    label: 'Messages',
    path: '/messages'
  }
};
```

### Step 6: Update Messages page

Mark messages as seen when the page loads:

```typescript
// In Messages.tsx
import { useMessageBadge } from '@/hooks/useMessageBadge';

const Messages = () => {
  const { markAsSeen } = useMessageBadge();
  
  // Mark as seen when component mounts
  useEffect(() => {
    markAsSeen();
  }, [markAsSeen]);
  
  // ... rest of component
};
```

### Step 7: Update Realtime handlers

Increment counter instead of just setting boolean flag:

```typescript
// In useNotificationsRealtime.ts
// Replace: setHasNewNotifications(true)
// With: incrementNewNotificationCount() 
```

---

## Data Flow Diagram

```text
Admin changes request status
       |
       v
Supabase Realtime triggers
       |
       v
useNotificationsRealtime receives event
       |
       v
incrementCount() called
       |
       v
Badge shows: previousCount + 1

---

User opens notification dropdown
       |
       v
handleOpenChange(true) called
       |
       v
markAsSeen() called
       |
       v
- Saves current timestamp to localStorage
- Sets count to 0
       |
       v
Badge shows: 0

---

Staff sends message
       |
       v
Supabase Realtime triggers INSERT
       |
       v
useMessageBadge detects sender_type='staff'
       |
       v
setUnreadCount(prev => prev + 1)
       |
       v
Message badge shows: previousCount + 1

---

User opens Messages page
       |
       v
useEffect calls markAsSeen()
       |
       v
- Saves current timestamp to localStorage
- Sets count to 0
       |
       v
Message badge shows: 0
```

---

## Summary of Changes

| Change | Impact |
|--------|--------|
| New `useNotificationBadge` hook | Tracks notification "last seen" timestamp |
| New `useMessageBadge` hook | Tracks message "last seen" timestamp and unread count |
| Updated `useNotificationsState` | Supports increment/reset pattern |
| Updated `NotificationMenu` | Resets badge when opened |
| Updated `BottomNav` | Shows real unread message count |
| Updated `Messages` page | Resets message badge on load |
| Updated realtime handlers | Increment counters on new notifications |

---

## Expected Results

After implementation:
1. Notification bell badge shows count of NEW notifications (since last opened)
2. Opening the notification dropdown resets badge to 0
3. Messages icon shows count of unread messages from staff
4. Opening the Messages page resets message badge to 0
5. Real-time updates increment badges as new notifications/messages arrive

