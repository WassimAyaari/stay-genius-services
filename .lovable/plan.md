

# Plan: Fix Duplicate Guest Records

## Root Cause

The `guests` table has no **unique constraint** on `user_id`. The `syncGuestData` function uses a check-then-insert pattern that is vulnerable to race conditions -- two concurrent calls both see "no existing record" and both insert, creating duplicates. The existing cleanup code runs too late to prevent the issue.

## Solution: Two-Part Fix

### Part 1: Database Migration -- Add Unique Constraint

1. **Delete existing duplicates** keeping only the most recent record per `user_id`
2. **Add a unique index** on `user_id` (partial, where `user_id IS NOT NULL`) to prevent future duplicates

```sql
-- Delete duplicates, keeping the most recent per user_id
DELETE FROM guests
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id
  FROM guests
  WHERE user_id IS NOT NULL
  ORDER BY user_id, created_at DESC
);

-- Prevent future duplicates
CREATE UNIQUE INDEX idx_guests_user_id_unique 
ON guests (user_id) 
WHERE user_id IS NOT NULL;
```

### Part 2: Simplify Sync Code

With the unique constraint in place, replace the check-then-insert pattern in `guestSyncService.ts` with a proper Supabase **upsert** using `onConflict: 'user_id'`. This is atomic and race-condition-proof.

```typescript
// Instead of: check if exists -> update or insert -> cleanup
// Just do:
const { error } = await supabase
  .from('guests')
  .upsert(guestData, { onConflict: 'user_id' });
```

## Files to Modify

| File | Change |
|------|--------|
| Database migration | Remove duplicates + add unique index on `user_id` |
| `src/features/users/services/guestSyncService.ts` | Replace check-then-insert with simple `upsert` on `user_id` conflict |
| `src/features/users/services/guestRetrievalService.ts` | Remove duplicate-checking logic (no longer needed) |
| `src/features/users/services/guestCleanupService.ts` | Can be simplified or kept as a safety net |

## Impact

- **Immediately cleans up** all 8 sets of duplicate records currently in the database
- **Permanently prevents** future duplicates at the database level
- **Simplifies** the sync code by removing the race-condition-prone check-then-insert pattern
- No UI changes needed -- the guest list will automatically show unique entries

