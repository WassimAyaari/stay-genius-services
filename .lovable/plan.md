
# Fix Chat Management Page to Be Fixed (No Page Scroll)

## Problem

The entire Chat Management page scrolls as a whole, pushing the header and stats off-screen. The conversation list and message area should scroll independently within a fixed viewport.

## Solution

Make the page fill the available viewport height with no outer scroll. Only the conversation list (left) and the messages area (right) should scroll internally.

## Change

### File: `src/components/admin/chat/AdminChatDashboard.tsx`

- Change the outer container from `flex-1 flex flex-col h-full overflow-hidden` to `flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden` (subtracting the mobile sidebar trigger header height, 3.5rem / 56px)
- Make the header and stats cards use `shrink-0` so they never collapse
- The side-by-side panel (`flex flex-1 ... overflow-hidden`) already handles internal scrolling via `ScrollArea` on the left and `overflow-y-auto` in the messages list on the right -- this just needs the parent to have a fixed height, which the `h-[calc(...)]` + `overflow-hidden` provides
- Change `mb-6` on the side-by-side container to `mb-0` (or keep a small padding) so it stretches to the bottom

### Specific line changes:

1. **Line 78**: `h-full` to `h-[calc(100vh-3.5rem)]` -- locks the page to viewport height
2. **Lines 80, 89**: Add `shrink-0` to the header and stats divs so they don't collapse
3. **Line 114**: Change `mb-6` to `mb-6` and add `min-h-0` to ensure flex children can shrink and scroll properly

This ensures the header + stats stay pinned at the top, the conversation list scrolls on the left, and messages scroll on the right.
