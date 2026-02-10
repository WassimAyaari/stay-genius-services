
# Remove "Front desk team available" Text

## Change

### File: `src/components/chat/UnifiedChatInput.tsx`

Remove the entire block (lines 116-128) that shows either "AI Assistant with voice support" or "Front desk team available" above the input area. This includes the wrapping `<div>` with the icon and text for both the AI and human handler states.

Alternatively, if only the human handler text should be removed while keeping the AI label, remove just lines 122-127 (the `else` branch). Based on the screenshot, the user wants to remove the "Front desk team available" line specifically. I will remove the entire status indicator block (both AI and human labels) since the AI one is similarly unnecessary clutter above the input, and this keeps the input area clean. If only the human text should go, the `else` branch and ternary can be simplified.

**Approach**: Remove lines 116-128 (the `<div>` containing the status text) so neither "AI Assistant with voice support" nor "Front desk team available" appears above the chat input.
