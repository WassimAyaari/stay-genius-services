

# Plan: Connect User Service Requests to Admin Dashboard

## Current State Analysis

After thorough investigation, I found:

1. **User-side submission WORKS**: When a user selects a service (Security, Maintenance, IT, Housekeeping) from the search dialog, it correctly calls `requestService()` which inserts into the `service_requests` table with:
   - `category_id` (the category of the request)
   - `request_item_id` (the specific item selected)
   - `guest_id`, `guest_name`, `room_number`
   - `description`, `type`, `status`

2. **Admin-side viewing WORKS**: The admin pages (SecurityManager, MaintenanceManager, HousekeepingManager, InformationTechnologyManager) fetch requests using `useRequestsData` hook and filter by `category_id`.

3. **Data is being stored**: Verified in the database - the most recent request from today shows proper data with category linkage.

## Issue Identified

The query in `useServiceRequests` uses `select('*')` which doesn't fetch the related `request_items` data. This means the admin tables show the description instead of the item name when available.

## Implementation Steps

### Step 1: Update useServiceRequests to Include Related Data

**File: `src/hooks/useServiceRequests.tsx`**

Update the Supabase query to include the `request_items` relationship:

| Change | Current | Updated |
|--------|---------|---------|
| Line 33 | `.select('*')` | `.select('*, request_items(*)')` |
| Line 50 | `.select('*')` | `.select('*, request_items(*)')` |
| Line 69 | `.select('*')` | `.select('*, request_items(*)')` |

This ensures that when a request has a `request_item_id`, the related item data (name, description) is fetched along with the request.

### Step 2: Verify Real-time Updates

The `useRequestsData` hook already has real-time subscriptions set up that will trigger a refetch when requests are created or updated. This means admins will see new requests appear automatically without manual refresh.

## Technical Details

### Request Flow Diagram

```text
USER SIDE                                    ADMIN SIDE
┌─────────────────────────┐                 ┌──────────────────────────┐
│  /services page         │                 │  /admin/maintenance      │
│  ┌─────────────────┐    │                 │  /admin/housekeeping     │
│  │ CommandSearch   │    │                 │  /admin/security         │
│  │ (SearchDialog)  │    │                 │  /admin/information-tech │
│  └────────┬────────┘    │                 └───────────┬──────────────┘
│           │             │                             │
│           ▼             │                             ▼
│  ┌─────────────────┐    │                 ┌──────────────────────────┐
│  │ ConfirmDialog   │    │                 │  useRequestsData()       │
│  └────────┬────────┘    │                 │  (calls useServiceReq)   │
│           │             │                 └───────────┬──────────────┘
│           ▼             │                             │
│  ┌─────────────────┐    │                             ▼
│  │ requestService()│    │                 ┌──────────────────────────┐
│  │ (roomService.ts)│    │                 │  Filter by category_id   │
│  └────────┬────────┘    │                 │  Display in table        │
│           │             │                 └──────────────────────────┘
└───────────┼─────────────┘                             ▲
            │                                           │
            ▼                                           │
┌─────────────────────────────────────────────────────────┐
│                     SUPABASE DATABASE                    │
│                                                          │
│   service_requests table                                 │
│   ┌────────────────────────────────────────────────┐    │
│   │ id, guest_id, room_id, room_number, guest_name │    │
│   │ type, description, status, category_id         │    │
│   │ request_item_id, created_at, updated_at        │    │
│   └────────────────────────────────────────────────┘    │
│                        │                                 │
│                        │ FK                              │
│                        ▼                                 │
│   request_items table                                    │
│   ┌────────────────────────────────────────────────┐    │
│   │ id, name, description, category_id, is_active  │    │
│   └────────────────────────────────────────────────┘    │
│                                                          │
│   Real-time subscription ────────────────────────────────┼──▶ Admin refetch
└──────────────────────────────────────────────────────────┘
```

### Category Mapping

| Category | ID | Admin Page |
|----------|-----|------------|
| Housekeeping | `7beb3ccf-bbcf-4405-a397-6b6c636c955b` | `/admin/housekeeping` |
| Information Technology | `2f96741e-3e04-4117-8d37-e94795e37a68` | `/admin/information-technology` |
| Maintenance | `621e423a-413f-4e8f-b471-bbd64e9c8c44` | `/admin/maintenance` |
| Security | `44b20203-fcc1-4cfc-88d9-30ef32b2f326` | `/admin/security` |

### Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useServiceRequests.tsx` | Add `request_items(*)` to select queries |

## Testing Verification

After implementation:
1. Go to `/services` as a user
2. Search and select a service item (e.g., "A/C noise" from Maintenance)
3. Confirm the request
4. Go to `/admin/maintenance` as admin
5. The request should appear in the "Requests" tab with:
   - Room number
   - Guest name
   - Request item name (not just description)
   - Date
   - Status with action buttons

