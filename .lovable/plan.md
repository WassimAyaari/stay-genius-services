
# Plan: Fix Events Page Routing

## Problem Summary
When clicking "Events & Promos" in the menu, the URL changes to `/events` but displays the Profile page instead of the Events list.

## Root Cause
Route conflict in `App.tsx`:
- Line 22: `<Route path="/*" element={<PublicRoutes />} />` - contains the Events page
- Line 26: `<Route path="/events/*" element={<AuthenticatedRoutes />} />` - catches ALL `/events/*` URLs

When navigating to `/events`:
1. The more specific `/events/*` route matches first
2. This sends the request to `AuthenticatedRoutes`
3. Inside `AuthenticatedRoutes`, the path is empty, so `<Route path="/" element={<Profile />} />` matches
4. Profile page is displayed

The actual Events list page is in `PublicRoutes` at path `events`, but it never gets reached.

---

## Solution

Modify `App.tsx` to only route **specific authenticated event paths** to `AuthenticatedRoutes`, not all `/events/*` paths.

### Option: Use explicit path for event details

Change from:
```tsx
<Route path="/events/*" element={<AuthenticatedRoutes />} />
```

To a more specific pattern that only catches event detail pages (not the main events list):
```tsx
{/* Remove this line - it intercepts the Events page */}
```

And move the event detail route to be handled differently, or add the Events list route to AuthenticatedRoutes as well.

**Best approach**: Since the Events list (`/events`) should be public and accessible without authentication, while event details (`/events/:id`) require authentication, we need to restructure the routing.

### Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Remove the catch-all `/events/*` route that sends everything to AuthenticatedRoutes |
| `src/routes/PublicRoutes.tsx` | Add the event detail route here, OR keep it in authenticated routes with proper path handling |

### Recommended Implementation

**Option A: Make event detail route more specific**

In `App.tsx`, change:
```tsx
// FROM:
<Route path="/events/*" element={<AuthenticatedRoutes />} />

// TO: Remove this line entirely
```

Then in `PublicRoutes.tsx`, add the event detail route:
```tsx
<Route path="events" element={<Events />} />
<Route path="events/:id" element={<EventDetail />} />  // Add this
```

This way:
- `/events` shows the Events list (public)
- `/events/:id` shows event details (can still require auth through component-level guards if needed)

---

## Technical Details

The issue is a classic React Router route matching problem where wildcard routes can intercept paths meant for other route groups.

### Current Flow (broken)
```text
User clicks "Events & Promos"
    ↓
Navigate to /events
    ↓
App.tsx: /events/* matches (line 26)
    ↓
AuthenticatedRoutes renders
    ↓
Internal path is "/" (empty after /events consumed)
    ↓
<Route path="/" element={<Profile />} /> matches
    ↓
Profile page displays ✗
```

### Fixed Flow
```text
User clicks "Events & Promos"
    ↓
Navigate to /events
    ↓
App.tsx: /* matches (no more /events/* override)
    ↓
PublicRoutes renders
    ↓
<Route path="events" element={<Events />} /> matches
    ↓
Events page displays ✓
```

---

## Expected Result

After this fix:
1. Clicking "Events & Promos" in the menu navigates to `/events`
2. The Events list page displays correctly with all events
3. Individual event details (`/events/:id`) still work properly
