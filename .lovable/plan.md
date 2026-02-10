

# Add Red Notification Badge to Security "Requests" Tab

## Problem
The Security Management page lacks a notification badge on the "Requests" tab trigger. The sidebar correctly shows a red badge with the new pending count, but when looking at the tabs themselves, there's no visual cue. When clicking "Requests", the sidebar badge clears (expected behavior via `markSectionSeen`), but the user has no indication on the tab itself.

## Fix

### File: `src/pages/admin/SecurityManager.tsx`
- Import `Badge` from `@/components/ui/badge`
- Use the existing `useAdminNotifications` hook (already imported) to read `counts.security`
- Add a red `Badge` inside the "Requests" `TabsTrigger` showing the count when it is greater than 0
- Style it consistently with the sidebar notification badges (red/destructive variant)

### Result
- A red badge appears on the "Requests" tab when there are new pending security requests
- Clicking "Requests" clears both the tab badge and the sidebar badge (via `markSectionSeen`)
- Consistent with the notification system already in place

