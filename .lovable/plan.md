

# Speed Up Restaurant List Loading

## Problem
The `RestaurantManager` component has a `useEffect` on mount (lines 43-45) that calls `handleRefresh()`, which invalidates the React Query cache and forces a full database re-fetch every time you navigate to the page. This causes the loading spinner to appear even when the data is already cached.

Other admin pages (Spa, Events, etc.) rely on React Query's built-in caching with `staleTime` and `refetchOnWindowFocus`, so they load instantly from cache when navigating back. The restaurant page bypasses this entirely.

## Fix

### File: `src/pages/admin/RestaurantManager.tsx`
- **Remove lines 43-45** (the `useEffect` that calls `handleRefresh()` on mount)
- React Query already handles caching with a 5-minute `staleTime` and `refetchOnWindowFocus: true`, which is sufficient to keep data fresh without forcing a re-fetch on every navigation

This single change will make the restaurant page load as fast as all other admin pages.

