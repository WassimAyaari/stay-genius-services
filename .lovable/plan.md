

# Plan: Fix Page Flash During Admin Navigation

## Problem

When navigating between admin pages (e.g., from Dashboard to Guests), the entire page turns white because:

1. The `useAuthGuard` hook re-runs on every route change due to `location.pathname` in its dependency array
2. It sets `loading = true` immediately, triggering a full-page `LoadingSpinner`
3. The `LoadingSpinner` replaces the entire UI (including the sidebar) with a white screen

This creates a jarring visual experience where the sidebar disappears and reappears.

---

## Root Cause

In `src/features/auth/hooks/useAuthGuard.ts` (line 214):

```typescript
}, [navigate, toast, location.pathname, adminRequired]);
```

Every URL change triggers the effect, which calls `setLoading(true)` before running auth checks. The `AuthGuard` then renders a full-screen spinner instead of the layout.

---

## Solution

Implement a two-part fix:

1. **Preserve auth state across navigation** - Only show loading on initial auth check, not on subsequent route changes
2. **Keep layout mounted during loading** - Move the loading state to only affect the content area, not the entire page

---

## Files to Modify

| File | Change |
|------|--------|
| `src/features/auth/hooks/useAuthGuard.ts` | Track initial load vs route changes; skip full re-auth on internal navigation |
| `src/components/AuthGuard.tsx` | Preserve children during internal navigation when already authorized |

---

## Implementation Details

### Change 1: useAuthGuard.ts

Add a ref to track if initial auth check has completed. Only set `loading = true` on initial load:

```typescript
// Add useRef import
import { useState, useEffect, useRef } from 'react';

export const useAuthGuard = (adminRequired: boolean = false) => {
  // ... existing state
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  
  // NEW: Track if initial auth is complete
  const initialAuthDone = useRef(false);
  
  useEffect(() => {
    // ... existing auth page check
    
    const checkAuth = async () => {
      // Only show loading spinner on initial load
      if (!initialAuthDone.current) {
        setLoading(true);
      }
      
      // ... existing auth logic
      
      // Mark initial auth as done
      initialAuthDone.current = true;
      setLoading(false);
    };
    
    // If already authorized and initial auth is done, skip re-check
    if (initialAuthDone.current && authorized) {
      return;
    }
    
    checkAuth();
    
    // ... rest of effect
  }, [navigate, toast, location.pathname, adminRequired]);
  
  return { loading, authorized, isAuthPage };
};
```

### Change 2: AuthGuard.tsx

Keep children rendered when already authorized, even during loading:

```typescript
// Current (problematic):
if (loading) {
  return <LoadingSpinner />;
}

// New (preserves layout):
if (loading && !authorized) {
  return <LoadingSpinner />;
}
```

This ensures that once a user is authorized, the layout (including sidebar) remains visible during any subsequent checks.

---

## Visual Impact

| Before | After |
|--------|-------|
| Click sidebar link → Entire page goes white → New page appears | Click sidebar link → Sidebar stays → Content area updates |

---

## Alternative Approach (More Robust)

If the above doesn't fully resolve the issue, a more comprehensive fix would be to:

1. **Move loading state to the content area only** - Instead of `AuthGuard` returning `LoadingSpinner`, pass a loading state to `AdminLayout` which shows a spinner only in the content area
2. **Use React Query's cache** - Leverage `staleTime` to prevent re-fetching auth data on every navigation
3. **Remove `location.pathname` from dependencies** - Only re-check auth when `adminRequired` changes, not on every route change

---

## Summary

This fix ensures that:
- The sidebar remains visible during all admin page navigations
- Full-page loading spinner only shows on initial page load (first visit to admin)
- Internal navigation only refreshes the content area
- User experience matches the expected behavior where layout persists

