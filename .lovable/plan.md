
# Chat Management: Side-by-Side Layout

## Overview

Redesign the Chat Management page to show conversations on the left and messages on the right side simultaneously, matching the reference screenshot layout. Also remove the red "Needs Attention" badges next to each conversation name.

## Changes

### File: `src/components/admin/chat/AdminChatDashboard.tsx`

**Remove badges:**
- Remove the `getStatusBadge` function and the `<Badge>` next to each conversation name in the list

**Side-by-side layout:**
- Replace the current full-page swap (list OR detail) with a two-column flex layout
- Left panel (~35% width, with border): shows the stats cards, tabs, and scrollable conversation list
- Right panel (~65% width): shows either a "Select a conversation" placeholder or the `UnifiedChatContainer` for the selected conversation
- When a conversation is clicked, it highlights in the left list and loads messages on the right -- no page navigation needed
- Remove the "Back to Dashboard" button since both panels are always visible

**Conversation list items:**
- Show guest name (bold), room number, last message preview, and relative time
- Add an avatar with initials (like the reference)
- Highlight the active/selected conversation row with a left border accent

### Layout Structure

```text
+------------------------------------------+
|  Chat Management             [Refresh]   |
+------------------------------------------+
| Stats Cards (3 across full width)        |
+------------------+-----------------------+
| Conversations    | Guest Name            |
| [Tabs]           | Room XXX              |
|                  +-----------------------+
| > Guest A  12d   |                       |
|   Guest B  15d   |   [Message bubbles]   |
|   Guest C  27d   |                       |
|                  |                       |
|                  +-----------------------+
|                  | [Type your reply...]  |
+------------------+-----------------------+
```

## Technical Details

- The left panel uses `ScrollArea` for the conversation list
- The right panel renders `UnifiedChatContainer` when `selectedConversation` is set, or a placeholder with a chat icon and "Select a conversation" text when nothing is selected
- Conversation rows use `cn()` for conditional active styling: `bg-muted` and `border-l-[3px] border-primary`
- Stats cards remain at the top spanning full width
- Tabs (Needs Attention / AI Handled / All Chats) stay in the left panel header
- The conversation list items show: avatar initials, name, room number, last update time -- no status badge
