

# Plan: Fix Navigation Bar Movement When Opening Dropdown Menus

## Problem Summary

When clicking on the notification icon, user avatar menu, or main menu in the top navbar, both the top and bottom navigation bars shift slightly. This occurs when the dropdown/popover opens and again when it closes.

## Root Cause Analysis

Based on investigation and session replay data, the movement is caused by two related issues:

| Cause | Description |
|-------|-------------|
| **Scrollbar shift** | When Radix UI dropdowns/dialogs open, some may lock body scroll, causing the scrollbar to disappear. This shifts the viewport width and all fixed elements move slightly |
| **Radix Popper transforms** | The Radix UI Popper component applies dynamic transform styles (`translate(1221.11px, 55.5556px)`) to position dropdown content, which can cause layout recalculations |

The key evidence from session replay shows:
- Elements get `transform: "translate(1221.11px, 55.5556px)"` 
- CSS variables like `--radix-popper-transform-origin: "100% 0px"` are applied
- These style updates occur when `data-state` changes from closed to open

## Solution

### Part 1: Add Scrollbar Gutter to Prevent Width Shift

Add `scrollbar-gutter: stable` to the HTML/body to reserve space for the scrollbar even when it's hidden. This prevents the viewport from shifting when modals/dropdowns lock body scroll.

### Part 2: Disable Modal Behavior on DropdownMenu

The DropdownMenu component uses `modal={true}` by default, which locks body scroll and can cause the scrollbar shift. Setting `modal={false}` on the dropdown menus will prevent this behavior while still allowing normal dropdown functionality.

### Part 3: Update Sheet Component for Smoother Transitions

The Sheet component (used by MainMenu) also locks body scroll. We'll ensure consistent behavior across all navigation overlays.

## Files to Modify

| File | Change |
|------|--------|
| `src/index.css` | Add `scrollbar-gutter: stable` to html/body |
| `src/components/NotificationMenu.tsx` | Add `modal={false}` to DropdownMenu |
| `src/components/UserMenu.tsx` | Add `modal={false}` to DropdownMenu |

## Implementation Details

### 1. src/index.css

Add scrollbar-gutter to the base styles:

```css
html {
  scrollbar-gutter: stable;
}

body {
  overflow-y: scroll; /* Always show scrollbar track */
}
```

The `scrollbar-gutter: stable` CSS property reserves space for the scrollbar in the layout, preventing the page from shifting when scrollbars appear or disappear.

### 2. src/components/NotificationMenu.tsx

Change the DropdownMenu to non-modal mode:

```tsx
// Before
<DropdownMenu onOpenChange={handleOpenChange}>

// After
<DropdownMenu modal={false} onOpenChange={handleOpenChange}>
```

When `modal={false}`:
- Body scroll is not locked when the dropdown opens
- The scrollbar remains visible
- No viewport width changes occur

### 3. src/components/UserMenu.tsx

Same change for the user menu dropdown:

```tsx
// Before
<DropdownMenu>

// After
<DropdownMenu modal={false}>
```

## Technical Explanation

| Property | Effect |
|----------|--------|
| `scrollbar-gutter: stable` | Reserves space for the scrollbar, preventing layout shift when scrollbar appears/disappears |
| `overflow-y: scroll` | Ensures the scrollbar track is always present |
| `modal={false}` | Prevents Radix UI from locking body scroll and applying scroll-prevention styles |

## Expected Result

After these changes:
1. The top navbar will remain perfectly stable when opening/closing the notification menu
2. The top navbar will remain stable when opening/closing the user avatar menu
3. The bottom navbar will not shift during any dropdown interactions
4. The main menu (Sheet) will open smoothly without causing navigation shifts
5. Dropdown menus will still function normally with proper positioning and outside-click closing

