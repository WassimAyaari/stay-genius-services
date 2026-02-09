
# Plan: Align Chat Management Layout with Dashboard

## Problem

The Chat Management page uses `container mx-auto max-w-6xl` which centers and constrains the content, creating visual padding on both sides. The Dashboard page uses `flex-1 space-y-6 p-6` which lets content start from the edge of the page.

## Change

**File: `src/components/admin/chat/AdminChatDashboard.tsx`** (line 135)

Replace:
```
<div className="container mx-auto p-6 max-w-6xl">
```

With:
```
<div className="flex-1 space-y-6 p-6">
```

This single change makes the Chat Management page layout match the Dashboard, with titles and content aligned to the left edge.
