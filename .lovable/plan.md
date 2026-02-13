

# Moderator Assignment Notifications

## Overview
When an admin assigns a service request ticket to a moderator, the assigned moderator will receive a notification visible in their admin panel. This requires a new `staff_notifications` table and integration into the existing admin notification system.

## Database Changes

### New table: `staff_notifications`
A dedicated table to store notifications for staff members (moderators, admins, etc.).

```text
staff_notifications
+------------------+------------------------+
| Column           | Type                   |
+------------------+------------------------+
| id               | uuid (PK)              |
| user_id          | uuid (recipient)       |
| type             | text (e.g. 'assignment')|
| title            | text                   |
| message          | text                   |
| reference_id     | uuid (service_request) |
| reference_type   | text (e.g. 'service_request') |
| is_read          | boolean (default false)|
| created_at       | timestamptz            |
+------------------+------------------------+
```

### RLS Policies
- Staff can view their own notifications: `user_id = auth.uid()`
- Staff can update (mark read) their own notifications: `user_id = auth.uid()`
- Admins can insert notifications for anyone: `is_admin(auth.uid())`
- System/authenticated users can insert (for the assignment flow): open INSERT policy

### Realtime
Add `staff_notifications` to the Supabase realtime publication so moderators get live updates.

## Code Changes

### 1. Update `AssignToDropdown.tsx`
After successfully assigning a ticket, insert a row into `staff_notifications` with:
- `user_id`: the assigned moderator's user ID
- `type`: `'assignment'`
- `title`: `'New ticket assigned'`
- `message`: Details about the service request (room, type, description)
- `reference_id`: the service request ID
- `reference_type`: `'service_request'`

### 2. Create `useStaffNotifications.ts` hook
A new hook that:
- Fetches unread `staff_notifications` for the current user
- Subscribes to realtime INSERT events on `staff_notifications` filtered by `user_id`
- Provides `markAsRead` and `markAllAsRead` functions
- Returns unread count and notification list

### 3. Update `AdminSidebar.tsx`
- Add a notification bell icon (or badge) in the sidebar header that shows the unread staff notifications count
- Clicking it opens a dropdown/popover listing the notifications with links to the relevant service request page

### 4. Create `StaffNotificationBell.tsx` component
A bell icon component placed in the admin sidebar header that:
- Shows unread count badge
- Opens a dropdown with recent notifications
- Each notification links to the relevant service page (housekeeping, maintenance, etc.)
- Allows marking notifications as read

## Technical Details

### Mapping `reference_type` to routes
The notification will link to the correct admin service page based on the service request's type/category:
- housekeeping -> `/admin/housekeeping`
- maintenance -> `/admin/maintenance`
- security -> `/admin/security`
- it_support -> `/admin/information-technology`

### Files to create
- `src/hooks/admin/useStaffNotifications.ts`
- `src/components/admin/StaffNotificationBell.tsx`

### Files to modify
- `src/components/admin/AssignToDropdown.tsx` (add notification insert after assignment)
- `src/components/admin/AdminSidebar.tsx` (add StaffNotificationBell to header)

### Database migration
- Create `staff_notifications` table with RLS policies
- Add table to realtime publication

