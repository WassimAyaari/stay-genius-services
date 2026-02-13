
# Change Assign Button Color and Icon When Ticket is Assigned

## Problem
When a ticket is assigned to someone, the button shows the person's name instead of "Assign", but the visual styling (color and icon) remains unchanged. The user wants a clear visual distinction to indicate that a ticket has been assigned.

## Solution
Modify the `AssignToDropdown.tsx` component to:

1. **Change button variant/color when assigned**:
   - Unassigned state: Keep the current `variant="outline"` (gray, neutral look)
   - Assigned state: Switch to `variant="default"` or a custom color (e.g., green/blue) to visually indicate ownership

2. **Swap the icon when assigned**:
   - Unassigned state: Show `UserPlus` icon (person with + symbol)
   - Assigned state: Show `User` icon (person only, no +) to remove the "plus" visual

3. **Keep the person's name displayed** when assigned (already working)

## Implementation Details

The change is simple - add conditional logic to the button styling:
```
- When assignedToName is null/undefined → show variant="outline" with UserPlus icon
- When assignedToName exists → show variant="default" (or variant with a blue/green color) with User icon
```

Import `User` icon from lucide-react alongside the existing `UserPlus` import.

## Files to Modify
- `src/components/admin/AssignToDropdown.tsx` - Update button variant and icon conditionally based on `assignedToName`

