

# Plan: Admin Notification Badges for New Reservations and Requests

## Overview

Add real-time notification badges in the admin sidebar to alert staff when new reservations (restaurant, spa, event) or service requests arrive. Badges appear next to sidebar items and disappear when the admin navigates to the corresponding page.

## How It Works

1. **Track "last seen" timestamps** per admin section using localStorage (similar to the guest notification system)
2. **Query pending counts** from Supabase for each section (pending table reservations, spa bookings, event reservations, service requests)
3. **Display red badges** in the sidebar next to the relevant menu items
4. **Clear badges** when the admin navigates to that section's page
5. **Real-time updates** via Supabase subscriptions to increment counts live

## Technical Changes

### 1. New Hook: `src/hooks/admin/useAdminNotifications.ts`

A centralized hook that:
- Stores per-section "last seen" timestamps in localStorage (keys like `admin_lastSeen_restaurants`, `admin_lastSeen_spa`, etc.)
- Queries Supabase for counts of records created after each section's last-seen timestamp:
  - `table_reservations` with `status = 'pending'` and `created_at > lastSeen`
  - `spa_bookings` with `status = 'pending'` and `created_at > lastSeen`
  - `event_reservations` with `status = 'pending'` and `created_at > lastSeen`
  - `service_requests` with `status = 'pending'` and `created_at > lastSeen` (grouped by category: housekeeping, maintenance, security, IT)
- Sets up Supabase realtime subscriptions on INSERT for each table
- Exposes: `{ counts: Record<string, number>, markSeen: (section: string) => void }`
- Uses `useQuery` with `refetchInterval: 30000` for polling backup
- Sections: `'restaurants'`, `'spa'`, `'events'`, `'housekeeping'`, `'maintenance'`, `'security'`, `'information-technology'`

### 2. Update: `src/components/admin/AdminSidebar.tsx`

- Import `useAdminNotifications` hook
- Import `SidebarMenuBadge` from sidebar UI
- Pass notification counts to each nav item
- Render a red badge circle next to items that have `count > 0`:
  ```tsx
  {count > 0 && (
    <SidebarMenuBadge className="bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
      {count}
    </SidebarMenuBadge>
  )}
  ```
- The "Services" section label will also show a badge if any child service has pending requests
- Call `markSeen(section)` when detecting the current route matches a section (via `useEffect` on `location.pathname`)

### 3. Update: `src/components/admin/AdminLayout.tsx`

- Wrap the sidebar context with the admin notifications provider/hook so it persists across page navigations

### 4. Mapping of routes to notification sections

| Route | Section Key | Data Source |
|-------|------------|-------------|
| `/admin/restaurants` | `restaurants` | `table_reservations` (pending) |
| `/admin/spa` | `spa` | `spa_bookings` (pending) |
| `/admin/events` | `events` | `event_reservations` (pending) |
| `/admin/housekeeping` | `housekeeping` | `service_requests` where category = Housekeeping |
| `/admin/maintenance` | `maintenance` | `service_requests` where category = Maintenance |
| `/admin/security` | `security` | `service_requests` where category = Security |
| `/admin/information-technology` | `information-technology` | `service_requests` where category = IT Support |

### 5. Dashboard Enhancement

On the admin dashboard, the existing stats already show pending counts. No additional changes needed -- the sidebar badges serve as the notification mechanism visible from any admin page.

## Badge Clearing Logic

- When `location.pathname` matches a section (e.g., starts with `/admin/restaurants`), call `markSeen('restaurants')` which updates localStorage timestamp to `now()` and resets that section's count to 0
- This means: navigating to Restaurants clears the restaurant badge; navigating to Spa clears the spa badge, etc.

## Files Created/Modified

| File | Action |
|------|--------|
| `src/hooks/admin/useAdminNotifications.ts` | **Create** -- centralized notification counts + realtime |
| `src/components/admin/AdminSidebar.tsx` | **Modify** -- render badges, call markSeen on route change |

No new dependencies needed. Uses existing `SidebarMenuBadge`, Supabase client, and React Query.

