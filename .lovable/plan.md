

# Fix: Duplicate Conversations, Missing Chat Notifications

## Issues Found

### 1. Duplicate Conversations Per User
**Root Cause**: In `useUnifiedChat.ts`, when initializing a conversation, the code only looks for conversations with `status: 'active'`:
```typescript
.eq('status', 'active')
```
When a conversation gets escalated (status changes to `'escalated'`), the next time the guest opens chat, no active conversation is found, so a **brand new conversation is created**. This is why "oussema bouaissi" appears 6+ times -- each escalation spawned a new conversation.

**Fix**: Change the query to also match `'escalated'` status using `.in('status', ['active', 'escalated'])`. This way, a user always reconnects to their existing conversation instead of creating duplicates.

### 2. No Chat Notifications in Admin Sidebar
**Root Cause**: The admin notification system (`useAdminNotifications.ts`) tracks reservations, bookings, service requests, and events -- but has **zero tracking for chat messages or conversations**. The "Chat Manager" sidebar item (line 89 of `AdminSidebar.tsx`) has no `notificationKey` property, so even if counts were tracked, no badge would display.

**Fix** (3 parts):
1. **Add `'chat'` to `SECTION_KEYS`** in `useAdminNotifications.ts`
2. **Add chat count logic** to `fetchCounts`: count conversations with new messages since the admin last viewed the chat section (using `admin_section_seen` table, same pattern as other sections). Count conversations where there are unread guest messages (messages with `sender_type = 'guest'` created after `last_seen_at` for the `'chat'` section key).
3. **Add `notificationKey: 'chat'`** to the Chat Manager nav item in `AdminSidebar.tsx`
4. **Subscribe to real-time changes** on the `messages` table (INSERT events) in the admin notifications channel
5. **Add `markSectionSeen('chat')`** call in `AdminChatDashboard.tsx` when the admin opens the chat page (same pattern used by restaurants, spa, etc.)

### 3. No Unread Badge Next to Individual Conversations
**Root Cause**: `ConversationListItem.tsx` has no concept of "unread" -- it simply shows the name and timestamp with no badge or visual indicator for new messages.

**Fix**: In `AdminChatDashboard`, track when each conversation was last viewed by the admin. Show an unread dot or count badge next to conversations that have messages newer than the admin's last view of that specific conversation.

---

## Technical Changes

### File 1: `src/hooks/useUnifiedChat.ts`
- Line 92: Change `.eq('status', 'active')` to `.in('status', ['active', 'escalated'])` so existing conversations are reused instead of creating duplicates

### File 2: `src/hooks/admin/useAdminNotifications.ts`
- Add `'chat'` to `SECTION_KEYS` array
- Add logic in `fetchCounts` to count conversations that have new guest messages since last seen
- Add real-time subscription for `messages` table INSERT events

### File 3: `src/components/admin/AdminSidebar.tsx`
- Line 89: Add `notificationKey: 'chat'` to the Chat Manager nav item

### File 4: `src/components/admin/chat/AdminChatDashboard.tsx`
- Call `markSectionSeen('chat')` on mount to clear the sidebar badge when the admin opens the chat page

### File 5: `src/components/admin/chat/ConversationListItem.tsx`
- Accept an optional `unreadCount` prop
- Display a small badge dot when there are unread messages

### Database: Add `messages` table to Supabase Realtime publication
- Ensure the `messages` table is included in the realtime publication so admin notification subscriptions work

## Data Cleanup
- Optionally provide a SQL query to merge or close the duplicate escalated conversations in the database, keeping only one active conversation per user per type

