

# Add Space Between Conversation List and Message Panel

## Change

### File: `src/components/admin/chat/AdminChatDashboard.tsx`

On line 114, change the side-by-side container from a single bordered box to a `gap-4` flex layout, and give each panel its own border/rounded styling instead of sharing one outer border.

- Remove the shared `border rounded-lg` from the outer flex container
- Add `gap-4` to the outer flex container
- Add `border rounded-lg` to the left panel (`w-[35%]`)
- Add `border rounded-lg` to the right panel (`flex-1`)

This creates a visible gap between the two panels, matching the reference screenshot.

