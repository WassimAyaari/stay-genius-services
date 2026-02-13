

# Remove "Hold" Status, Fix Moderator Permissions, and Hide Assign on Completed

## Three Changes

### 1. Remove "On Hold" status from all request tabs
Remove the "On Hold" button and related logic from all 4 request tab components:
- `HousekeepingRequestsTab.tsx`
- `MaintenanceRequestsTab.tsx`
- `SecurityRequestsTab.tsx`
- `InformationTechnologyRequestsTab.tsx`

The simplified action flow will be:
- **Pending** -> Start, Complete, Cancel
- **In Progress** -> Complete, Cancel
- **Completed** -> No actions (finished)
- **Cancelled** -> No actions

Also remove `on_hold` from type signatures in parent components (`HousekeepingManager.tsx`, `InformationTechnologyManager.tsx`).

### 2. Hide "Assign" button when status is "completed" or "cancelled"
In all 4 request tabs, conditionally render the `AssignToDropdown` only when the request status is not `completed` or `cancelled`.

### 3. Fix moderator permissions (RLS policy)
Moderators can view requests (`is_staff_member` SELECT policy) but **cannot update** them because the UPDATE policy only allows admins (`is_admin`) or the guest themselves (`guest_id = auth.uid()`).

**Fix**: Add a new RLS policy on the `service_requests` table:
```sql
CREATE POLICY "Staff can update service requests"
ON service_requests
FOR UPDATE
USING (is_staff_member(auth.uid()));
```

This allows moderators and staff to update request statuses (Start, Complete, Cancel).

## Files to Modify
- `src/pages/admin/housekeeping/components/HousekeepingRequestsTab.tsx` - Remove Hold buttons, hide Assign on completed
- `src/pages/admin/maintenance/components/MaintenanceRequestsTab.tsx` - Remove Hold buttons, hide Assign on completed
- `src/pages/admin/security/SecurityRequestsTab.tsx` - Remove Hold buttons, hide Assign on completed
- `src/pages/admin/information-technology/components/InformationTechnologyRequestsTab.tsx` - Remove Hold buttons, hide Assign on completed
- `src/pages/admin/HousekeepingManager.tsx` - Remove `on_hold` from type signature
- `src/pages/admin/InformationTechnologyManager.tsx` - Remove `on_hold` from type signature
- **Database**: Add RLS UPDATE policy for staff members on `service_requests`

