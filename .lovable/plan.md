

# Make Chat Notifications Instant and Red

## Problem
1. Chat notification badges use teal/primary color instead of red
2. The per-conversation unread badge in the conversation list should also be red
3. Notification updates may feel slower than other sections due to the full query refetch cycle

## Changes

### 1. Red unread badge on conversation list items
**File: `src/components/admin/chat/ConversationListItem.tsx` (line 44)**
- Change `bg-primary text-primary-foreground` to `bg-destructive text-destructive-foreground` so the unread count badge appears in red next to the user's name

### 2. Faster real-time unread updates in the dashboard
**File: `src/components/admin/chat/AdminChatDashboard.tsx`**
- In the realtime channel callback for message INSERTs (line 31-32), optimistically increment the unread count for the conversation immediately, without waiting for a full database refetch
- This makes the badge appear instantly when a guest sends a message, matching the speed of other notification types

### 3. Ensure sidebar badge also updates instantly
**File: `src/hooks/admin/useAdminNotifications.ts` (line 181)**
- The realtime subscription for messages INSERT is already in place -- no change needed here. The invalidation triggers a refetch which should update the sidebar badge within 1-2 seconds. If further speed is needed, we can add optimistic local count increment on the realtime event as well.

