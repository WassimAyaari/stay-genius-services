
# Plan: Display Navbar on Messages Page

## Issue Found

The `Layout.tsx` component has explicit conditions that hide both the header and bottom navigation when on the `/messages` route:

```typescript
const isMessagePage = location.pathname === '/messages' || location.pathname.startsWith('/messages?');

{!isMessagePage && (
  <header>...</header>
)}

{!isMessagePage && <BottomNav />}
```

Even though `Messages.tsx` now wraps the chat list with `<Layout>`, the navbar is still hidden because of these conditions.

## Solution

Remove the `isMessagePage` condition that hides the navbar. The chat list screen will show the navbar, and when a user enters an active chat, that view renders outside of `Layout` (with `fixed inset-0`), so it will still be full-screen immersive.

## File Change

| File | Change |
|------|--------|
| `src/components/Layout.tsx` | Remove `isMessagePage` from the conditions that hide header and bottom nav |

## Implementation

Update `Layout.tsx`:

```typescript
// Remove these conditions:
// {!isMessagePage && (<header>...)}
// {!isMessagePage && <BottomNav />}

// Change to:
{/* Header appears on all pages */}
<header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
  ...
</header>

<main className={cn("container mx-auto px-[9px]", "pt-16 pb-24", isSpaManagerPage && "h-screen flex flex-col")}>
  ...
</main>

<BottomNav />
```

## Result

After this change:
- The messages list page (`/messages`) will display the header with logo, menu, notifications, and user menu
- The bottom navigation bar will appear for easy access to other sections
- When a user clicks into an active chat, it will still be full-screen (as that renders with `fixed inset-0` outside of Layout)
- The existing ChatListScreen design stays exactly as it is
