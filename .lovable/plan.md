

## Fix: Notification Click - Navigate to Correct Service Page and Highlight Request

### Problem
The current notification has "service" in its message (not "housekeeping"), so the keyword-based route matching fails. Even after the previous fix, existing notifications still won't work. Additionally, you want the specific request row to be visually highlighted.

### Solution
Two changes:

1. **Smarter navigation**: Instead of matching keywords in the notification message, use the `reference_id` to look up the service request's category from the database, then navigate to the correct page.

2. **Highlight the request row**: Pass the request ID as a URL parameter (`?tab=requests&requestId=xxx`) and highlight the matching row in the requests table with a visual effect (e.g., a colored background that fades out).

### Technical Details

#### 1. Update `StaffNotificationBell.tsx`
- When a notification with `reference_type === 'service_request'` is clicked, fetch the service request from the database using `reference_id`
- Look up its `category_id` to determine the service type (Housekeeping, Maintenance, Security, IT)
- Navigate to the correct route with both `tab=requests` and `requestId` parameters
- Keep the keyword-based matching as a fallback

```
Category ID -> Route mapping:
  Housekeeping -> /admin/housekeeping
  Maintenance -> /admin/maintenance
  Security -> /admin/security
  Information Technology -> /admin/information-technology
```

#### 2. Update `HousekeepingRequestsTab.tsx` (and similar tabs for other services)
- Read the `requestId` URL parameter
- When rendering table rows, apply a highlight class (e.g., pulsing border or yellow background) to the matching row
- Auto-scroll to the highlighted row using a ref

### Files to Modify
- `src/components/admin/StaffNotificationBell.tsx` - New navigation logic using DB lookup
- `src/pages/admin/housekeeping/components/HousekeepingRequestsTab.tsx` - Add row highlighting
- `src/pages/admin/maintenance/components/MaintenanceRequestsTab.tsx` - Add row highlighting
- `src/pages/admin/security/components/SecurityRequestsTab.tsx` - Add row highlighting
- `src/pages/admin/information-technology/components/ITRequestsTab.tsx` - Add row highlighting

