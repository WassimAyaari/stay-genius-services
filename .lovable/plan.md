

# Per-Service Notification Badges in Spa Bookings

## Problem

The current "1 pending" and "7 pending" red badges next to each spa service name show **all** pending bookings, not just new ones. The user wants these badges to show only **new reservations since the admin last visited** that specific service's bookings -- matching the notification behavior used elsewhere.

## Solution

Extend the `admin_section_seen` system to track per-service "last seen" timestamps. When the admin opens a specific service's bookings (Level 2), mark that service as seen. The badge next to each service name will show only bookings created after the admin's last visit to that service.

## Changes

### 1. `src/hooks/admin/useAdminNotifications.ts`

- Add per-spa-service counts: fetch `spa_bookings` with `service_id` grouping, filtered by `created_at > last_seen_at` for each `spa:SERVICE_ID` key
- Export a new `spaServiceCounts` record (`Record<string, number>`) alongside existing `counts`
- Update `markSectionSeen` to also support keys like `spa:SERVICE_ID`

### 2. `src/pages/admin/spa/SpaBookingsTab.tsx`

- Import `useAdminNotifications` and use `spaServiceCounts` for badges instead of the current `getPendingCount` (which counts all pending)
- Replace `Badge variant="destructive"` showing "X pending" with a notification-style badge showing only new-since-last-seen count
- When the admin enters Level 2 (selects a service), call `markSectionSeen('spa:SERVICE_ID')` to clear that service's badge
- Keep `markSectionSeen('spa')` call in `SpaManager.tsx` to clear the sidebar badge when the Bookings tab is active

### 3. `src/pages/admin/SpaManager.tsx`

- No changes needed -- it already calls `markSectionSeen('spa')` for the sidebar badge

## How It Works

1. A guest books "Hammam & Sauna Experience" -- badge appears: "1" next to Hammam
2. The admin clicks on Hammam to view its bookings
3. `markSectionSeen('spa:hammam_id')` runs, badge drops to 0
4. Another guest books "Wellness" -- badge appears: "1" next to Wellness, Hammam stays at 0
5. The sidebar "Spa" badge also updates based on the aggregate of all per-service new counts

## Technical Details

- Section keys for per-service tracking use format `spa:SERVICE_UUID` in `admin_section_seen`
- `fetchCounts` will query `spa_bookings` grouped by `service_id`, comparing each booking's `created_at` against `last_seen_at` for its specific `spa:service_id` key
- The existing `spa` section key continues to work for the sidebar badge (counts all new spa bookings regardless of service)
- The total count text ("X bookings") remains unchanged -- it still shows total bookings per service

| File | Change |
|------|--------|
| `useAdminNotifications.ts` | Add `spaServiceCounts` with per-service new-booking counts, support `spa:ID` keys |
| `SpaBookingsTab.tsx` | Use `spaServiceCounts` for badges, call `markSectionSeen('spa:ID')` on entering Level 2 |

