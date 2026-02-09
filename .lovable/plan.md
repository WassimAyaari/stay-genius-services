

# Plan: Redirect "Start Chat" to /messages with Concierge Chat

## Overview

Change the "Start Chat" button on the Services page to navigate to `/messages` and automatically open the concierge conversation, instead of opening an inline chat overlay.

## Changes

### 1. `src/pages/services/Services.tsx`

- Change `handleStartChat` to navigate to `/messages` with state indicating the chat type:
  ```typescript
  const handleStartChat = () => {
    navigate('/messages', { state: { chatType: 'concierge' } });
  };
  ```
- Remove the `isChatOpen` state, the `UnifiedChatContainer` overlay, and the `UnifiedChatContainer` import (no longer needed on this page)

### 2. `src/pages/messages/Messages.tsx`

- Read `location.state?.chatType` on mount
- If `chatType` is `'concierge'`, auto-set `selectedChatType` to `'concierge'`, skipping the chat list screen

```typescript
const location = useLocation();

useEffect(() => {
  if (location.state?.chatType) {
    setSelectedChatType(location.state.chatType);
  }
}, [location.state]);
```

## Result

- Clicking "Start Chat" on Services navigates to `/messages` and lands directly in the concierge conversation
- The back button in the chat will return to the chat list as it does today
- No new dependencies or files needed

