

# Add "Assign To" Button for Service Request Tickets

## Overview
Add an "Assign to" button in the Actions column of each service's Requests table. Clicking it shows a dropdown listing only the moderators assigned to that specific service type (e.g., housekeeping moderators for housekeeping requests). When a moderator is selected, the request is assigned to them.

## Database Changes

### 1. Add `assigned_to` column to `service_requests`
- Add a nullable `assigned_to` UUID column to store the assigned moderator's user ID
- Add an `assigned_to_name` text column for quick display without extra joins

```sql
ALTER TABLE public.service_requests 
  ADD COLUMN assigned_to uuid,
  ADD COLUMN assigned_to_name text;
```

## New Shared Component

### 2. `src/components/admin/AssignToDropdown.tsx`
A reusable dropdown button component that:
- Accepts a `serviceType` prop (e.g., `'housekeeping'`, `'maintenance'`, `'security'`, `'it_support'`)
- Accepts `requestId` and current `assignedToName` props
- Fetches moderators from `moderator_services` filtered by `service_type`, joined with `guests` table for names
- Renders a DropdownMenu with the list of matching moderators
- On selection, updates `service_requests.assigned_to` and `assigned_to_name` for that request
- Shows the assigned moderator name if already assigned, or an "Assign" button if not
- Includes an "Unassign" option if already assigned

## Frontend Changes

### 3. Update `ServiceRequest` type (`src/features/rooms/types/index.ts`)
Add `assigned_to?: string` and `assigned_to_name?: string` fields.

### 4. Update all 4 Requests Tabs
Each tab gets the `AssignToDropdown` component added in the Actions column, passing the appropriate service type:

- **`HousekeepingRequestsTab.tsx`** -- serviceType = `'housekeeping'`
- **`MaintenanceRequestsTab.tsx`** -- serviceType = `'maintenance'`
- **`SecurityRequestsTab.tsx`** -- serviceType = `'security'`
- **`InformationTechnologyRequestsTab.tsx`** -- serviceType = `'it_support'`

The dropdown will appear alongside the existing action buttons (Hold, Start, Complete, Cancel) for active requests.

## Technical Details

### AssignToDropdown Component Logic
```text
1. On mount/open, query moderator_services WHERE service_type = [serviceType]
2. For each moderator user_id, fetch name from guests table
3. Display as a DropdownMenu with moderator names
4. On select: UPDATE service_requests SET assigned_to = [user_id], assigned_to_name = [name] WHERE id = [requestId]
5. Trigger a refetch of requests data
```

### Hook: `useServiceModerators`
A small custom hook to fetch and cache moderators by service type:
- Query `moderator_services` filtered by `service_type`
- Join with `guests` to get `first_name`, `last_name`
- Cache with React Query keyed by service type

## Files to Create/Edit
- **SQL migration**: Add `assigned_to` and `assigned_to_name` columns to `service_requests`
- **New**: `src/hooks/useServiceModerators.ts` -- hook to fetch moderators by service type
- **New**: `src/components/admin/AssignToDropdown.tsx` -- reusable assign dropdown
- **Edit**: `src/features/rooms/types/index.ts` -- add new fields to ServiceRequest
- **Edit**: `src/pages/admin/housekeeping/components/HousekeepingRequestsTab.tsx` -- add AssignToDropdown
- **Edit**: `src/pages/admin/maintenance/components/MaintenanceRequestsTab.tsx` -- add AssignToDropdown
- **Edit**: `src/pages/admin/security/SecurityRequestsTab.tsx` -- add AssignToDropdown
- **Edit**: `src/pages/admin/information-technology/components/InformationTechnologyRequestsTab.tsx` -- add AssignToDropdown
