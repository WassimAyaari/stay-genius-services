

# Fix Admin Notifications: Database-Persisted "Last Seen" Timestamps

## Problem

The notification badges currently show **all pending items** (e.g., 10 pending restaurant reservations = badge shows "10"). The user wants badges to show only **new items since the admin last visited** that section. And this "last visited" timestamp must survive logout/login.

## Solution

Create a database table `admin_section_seen` to store per-admin, per-section timestamps. When the admin navigates to a section's Requests tab, we update the timestamp. The badge count = pending items created **after** that timestamp.

## Changes

### 1. New Database Table: `admin_section_seen`

```sql
CREATE TABLE public.admin_section_seen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, section_key)
);

ALTER TABLE public.admin_section_seen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage their own seen timestamps"
  ON public.admin_section_seen
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### 2. File: `src/hooks/admin/useAdminNotifications.ts`

Update `fetchCounts` to:
- Fetch the current user's `admin_section_seen` rows
- For each section, count only pending items where `created_at > last_seen_at` for that section
- If no `last_seen_at` exists for a section, count all pending items (first-time behavior)

Add a new `markSectionSeen` function that upserts a row into `admin_section_seen` with the current timestamp for the given section key.

Export `markSectionSeen` alongside `counts`.

### 3. Admin Manager Pages (7 files)

When the admin navigates to the Requests tab (or the page itself for single-purpose pages like Spa/Events/Restaurants), call `markSectionSeen(sectionKey)`:

- `RestaurantManager.tsx` / `RestaurantReservationsManager.tsx` -- call `markSectionSeen('restaurants')` when the Bookings tab is active
- `SpaManager.tsx` -- call `markSectionSeen('spa')` when Bookings tab is active
- `EventsManager.tsx` -- call `markSectionSeen('events')` when Reservations tab is active
- `HousekeepingManager.tsx` -- call `markSectionSeen('housekeeping')` when Requests tab is active
- `MaintenanceManager.tsx` -- call `markSectionSeen('maintenance')` when Requests tab is active
- `SecurityManager.tsx` -- call `markSectionSeen('security')` when Requests tab is active
- `InformationTechnologyManager.tsx` -- call `markSectionSeen('information-technology')` when Requests tab is active

### 4. File: `src/components/admin/AdminSidebar.tsx`

No changes needed -- it already reads `counts` from `useAdminNotifications`.

## How It Works

1. A guest creates a new spa booking at 2:00 PM
2. The admin sidebar badge for Spa shows "1" (new since last visit)
3. The admin clicks on Spa and views the Bookings tab
4. `markSectionSeen('spa')` updates `admin_section_seen` with `last_seen_at = now()`
5. Badge drops to 0
6. Admin logs out and back in -- badge stays at 0 because the timestamp is in the database
7. Another guest books at 3:00 PM -- badge shows "1" again

## Summary

| Change | Description |
|--------|-------------|
| New table `admin_section_seen` | Stores per-user, per-section "last visited" timestamps |
| `useAdminNotifications.ts` | Filter counts by `created_at > last_seen_at`, add `markSectionSeen` |
| 7 admin manager pages | Call `markSectionSeen` when viewing the relevant tab |

