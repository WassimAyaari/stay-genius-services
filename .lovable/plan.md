
# Fix: Notification Click Not Redirecting to Service Page

## Root Cause
The notification message contains `"service - Room 400..."` instead of `"housekeeping - Room 400..."`. This happens because when creating the notification in `AssignToDropdown.tsx`, the code uses `requestData?.type` (which is always `"service"` in the database) instead of the `serviceType` prop (which correctly contains `"housekeeping"`, `"maintenance"`, etc.).

Since the click handler in `StaffNotificationBell.tsx` tries to match keywords like "housekeeping" in the message, it never finds a match and navigation doesn't happen.

## Fix
In `AssignToDropdown.tsx`, change line 45 from:
```
const reqType = requestData?.type || serviceType;
```
to:
```
const reqType = serviceType || requestData?.type;
```

This ensures the notification message starts with the correct service category name (e.g., `"housekeeping - Room 400..."`) so the route matching in `StaffNotificationBell` works properly.

## Files to Modify
- `src/components/admin/AssignToDropdown.tsx` (1 line change)

No other files need changes -- the navigation logic in `StaffNotificationBell.tsx` and the tab auto-selection in manager pages are already correct.
