

# Fix: Old Notifications Showing on First Login

## Problem
When a staff/moderator/admin logs in for the first time, the `admin_section_seen` table has no rows for that user. The notification counting logic falls back to epoch (`1970-01-01`), so every pending item in the entire database is counted as "new."

## Solution
When no `admin_section_seen` record exists for a section, instead of using epoch, automatically seed all section keys with the current timestamp on the user's first load. This treats all existing items as "already seen" and only new items created after login will trigger badges.

## Changes

### 1. Update `useAdminNotifications.ts` -- seed on first load
**File**: `src/hooks/admin/useAdminNotifications.ts`

In the `fetchCounts` function, after fetching `seenRows`, check if the user has any rows at all. If not (first login), insert rows for all section keys with `last_seen_at = now()` and return zero counts:

```
if (!seenRows || seenRows.length === 0) {
  const now = new Date().toISOString();
  const seedRows = SECTION_KEYS.map(key => ({
    user_id: user.id,
    section_key: key,
    last_seen_at: now,
  }));
  await supabase.from('admin_section_seen').upsert(seedRows, {
    onConflict: 'user_id,section_key',
  });
  // Return all zeros since everything is now "seen"
  return { counts: counts as Record<SectionKey, number>, restaurantCounts: {}, spaServiceCounts: {} };
}
```

This ensures:
- First login: all badges start at 0
- Subsequent logins: only items created after the last visit show as new
- No changes needed to any other file

