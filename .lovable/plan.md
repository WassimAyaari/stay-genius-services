

# Plan: Fix Content Spacing for Guest Pages

## Problem

The Guest 360° list page (`GuestsManager.tsx`) and Guest detail page (`GuestDetailPage.tsx`) have their content positioned too close to the sidebar. This is because they're missing the `p-6` padding that other admin pages like the Dashboard use.

| Page | Current Class | Has Padding |
|------|---------------|-------------|
| Dashboard | `flex-1 space-y-6 p-6` | Yes |
| GuestsManager | `space-y-6` | No |
| GuestDetailPage | `space-y-6` | No |

---

## Solution

Add the same padding (`p-6`) to both guest pages to match the Dashboard layout.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/admin/GuestsManager.tsx` | Add `p-6` to root div (line 146) |
| `src/pages/admin/GuestDetailPage.tsx` | Add `p-6` to root div (line 198) |

---

## Changes

### GuestsManager.tsx (Line 146)

```typescript
// From:
<div className="space-y-6">

// To:
<div className="flex-1 space-y-6 p-6">
```

### GuestDetailPage.tsx (Line 198)

```typescript
// From:
<div className="space-y-6">

// To:
<div className="flex-1 space-y-6 p-6">
```

---

## Summary

This is a simple fix that adds consistent `p-6` padding to both guest pages, matching the spacing pattern used on the Dashboard and other admin pages.

