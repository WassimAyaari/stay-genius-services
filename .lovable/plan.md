
# Apply Custom Color #d6f0f8 to Assigned Button

## Problem
Currently, the assign button uses `variant="default"` when assigned, which applies the primary color. The user wants a specific light blue color (#d6f0f8) for better visual distinction.

## Solution
Add an inline style to the button when `assignedToName` is true to apply the custom background color. The button component accepts a `className` prop that supports inline styles via the `style` attribute.

## Implementation Details

Modify the button on line 81 of `src/components/admin/AssignToDropdown.tsx`:

**Current:**
```tsx
<Button variant={assignedToName ? "default" : "outline"} size="sm" className="gap-1 whitespace-nowrap">
```

**Change to:**
```tsx
<Button 
  variant={assignedToName ? "default" : "outline"} 
  size="sm" 
  className="gap-1 whitespace-nowrap"
  style={assignedToName ? { backgroundColor: '#d6f0f8', color: '#1f2937' } : undefined}
>
```

This applies:
- **Background**: `#d6f0f8` (light blue) when assigned
- **Text color**: `#1f2937` (dark gray) for readability on the light background
- **No style** when unassigned (uses the outline variant normally)

## Files to Modify
- `src/components/admin/AssignToDropdown.tsx` - Add inline style to button when assigned

