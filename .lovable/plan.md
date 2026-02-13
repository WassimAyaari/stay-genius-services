
## Plan: Navigate to Service Request Detail Page from Notification

### Current State Analysis
- **Notifications System**: The `StaffNotificationBell.tsx` currently stores `reference_id` (the service request ID) in the `staff_notifications` table.
- **Current Navigation**: When clicking a notification, it navigates to the **service management page** (e.g., `/admin/housekeeping`) but doesn't open the specific request detail.
- **Detail Pages**: There's a `ServiceRequestDetails` page for guests (`/my-room/requests/:id`), but no dedicated admin-specific service request detail page yet.
- **Request Data**: Service requests have `id`, `room_number`, `guest_name`, `description`, `status`, `assigned_to`, `type`, `created_at`, etc.

### Solution Approach
Create a new **admin service request detail page** and update the notification click handler to navigate directly to it.

**Option A** (Recommended): Create a unified admin service request detail page that works for all service types (housekeeping, maintenance, security, IT) that:
- Fetches and displays the full request details
- Shows request status, assignment info, timestamps
- Allows admins to update status and reassign
- Provides quick navigation back to the requests list

**Option B**: Implement a modal/dialog that opens the request details inline without navigating away.

### Technical Changes

#### 1. Create New Admin Service Request Detail Page
- **File**: `src/pages/admin/ServiceRequestDetailPage.tsx`
- **Route**: `/admin/requests/:requestId` (add to `AdminRoutes.tsx`)
- **Functionality**:
  - Fetch service request by ID using `useServiceRequestDetail` hook
  - Display: Room, Guest, Request type, Description, Status, Assigned to, Created date
  - Action buttons: Update status, Reassign, Back button
  - Show the service type (Housekeeping, Maintenance, Security, IT) in breadcrumbs or header

#### 2. Create Service Request Detail Hook (if needed)
- Use existing `useServiceRequestDetail` hook or create a new one for admin context
- Hook should fetch from `service_requests` table with all necessary fields

#### 3. Update `StaffNotificationBell.tsx`
- Modify `handleNotificationClick` function to:
  1. Use `reference_id` (service request ID) from notification
  2. Use `reference_type` to determine service type
  3. Navigate to `/admin/requests/{reference_id}` instead of just the service page
  4. Mark notification as read

#### 4. Add Route in `AdminRoutes.tsx`
- Add new route: `<Route path="requests/:requestId" element={<ServiceRequestDetailPage />} />`

### Detailed Implementation Steps

1. **Create `ServiceRequestDetailPage.tsx`** - A full-page detail view for admin staff
   - Header with breadcrumbs (Admin > Housekeeping > Request #123)
   - Request details card showing:
     - Room number, Guest name, Service type
     - Request description, Created date/time
     - Current status with badge
     - Assigned to (with option to reassign via `AssignToDropdown`)
   - Status update buttons (same as table: Hold, Start, Complete, Cancel)
   - Back button to return to service management page

2. **Update navigation logic in `StaffNotificationBell.tsx`**
   - Change from navigating to `/admin/housekeeping` to `/admin/requests/{reference_id}`
   - Keep fallback to service page in case `reference_id` is missing

3. **Add route in `AdminRoutes.tsx`**
   - Register the new detail page route

4. **Extract service type from request data** (in the detail page)
   - Fetch the service request to determine its type
   - Use to show appropriate breadcrumb/header context

### File Changes Summary
- **Create**: `src/pages/admin/ServiceRequestDetailPage.tsx`
- **Modify**: `src/components/admin/StaffNotificationBell.tsx` (update `handleNotificationClick`)
- **Modify**: `src/routes/AdminRoutes.tsx` (add new route)

### User Flow
1. Admin assigns ticket to moderator → notification created with `reference_id`
2. Moderator clicks notification bell → sees notification list
3. Moderator clicks specific notification → navigates to `/admin/requests/{id}`
4. Detail page loads and displays full request context
5. Moderator can update status or reassign from detail page

### Fallback Behavior
If `reference_id` is missing (legacy notifications), navigate to the service management page as currently implemented.

