

# Plan: Fix About Editor Page Layout

## Problem

The About Editor page uses `container mx-auto p-6` which centers and constrains the content, creating unnecessary side margins. It should match the Dashboard's edge-to-edge layout.

## Change

**File: `src/pages/admin/AboutEditor.tsx`** (line ~103)

Replace:
```
<div className="container mx-auto p-6">
```

With:
```
<div className="flex-1 space-y-6 p-6">
```

This aligns the About Editor layout with the Dashboard and Chat Management pages.

