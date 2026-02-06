
# Plan: Remove Navigation Bar Movement on Interaction

## Problem Summary

When clicking on input fields or other interactive elements, both the top and bottom navigation bars shift slightly. This is caused by Framer Motion animations that re-apply transform values during component updates.

## Root Causes

1. **BottomNav.tsx**: Uses `AnimatePresence` and `motion.nav` with spring animations (`y: 0`, `y: "100%"`) that can cause micro-adjustments during re-renders
2. **Scroll-based visibility toggle**: The scroll handler in BottomNav updates state on every scroll, which can trigger animation recalculations
3. **Layout.tsx**: Uses `motion.div` for content fade-in which interacts with the fixed positioned navbars

## Solution

### Part 1: Simplify BottomNav Animations

Replace the Framer Motion spring animation with CSS transforms that only apply during actual show/hide transitions:

| Current | Change |
|---------|--------|
| `motion.nav` with AnimatePresence | Regular `nav` with CSS transition |
| Spring animation (`type: "spring"`) | CSS transform with transition |
| Re-applies transform on every render | Only transforms during visibility change |

### Part 2: Use CSS-only Transitions

Convert the bottom nav animation to use CSS `translate-y` with `transition` property instead of Framer Motion. This prevents animation recalculations on re-renders.

```tsx
// Before (Framer Motion)
<motion.nav 
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>

// After (CSS transition)
<nav 
  className={cn(
    "fixed bottom-0 left-0 right-0 ... transition-transform duration-300",
    isVisible ? "translate-y-0" : "translate-y-full"
  )}
>
```

### Part 3: Stabilize Header Position

Add `will-change: transform` and ensure the header has no transform-related properties that could cause layout shifts.

## Files to Modify

| File | Change |
|------|--------|
| `src/components/BottomNav.tsx` | Replace Framer Motion with CSS transitions |
| `src/components/Layout.tsx` | Remove motion.div opacity animation from content wrapper |

## Technical Details

### BottomNav.tsx Changes

1. Remove `motion` and `AnimatePresence` imports from framer-motion
2. Replace `motion.nav` with regular `nav` element
3. Use Tailwind's `translate-y-0` and `translate-y-full` classes with `transition-transform duration-300`
4. Remove the `initial`, `animate`, `exit`, and `transition` props

### Layout.tsx Changes

1. Remove `motion.div` wrapper for children content
2. Replace with regular `div` to prevent any transform interference
3. This removes potential animation side effects affecting fixed elements

## Expected Result

After these changes:
1. Navigation bars will remain perfectly stable when clicking inputs or other elements
2. The show/hide animation on scroll will still work smoothly using CSS transitions
3. No more micro-movements or "settling" of the navbars during interactions
4. Better performance as CSS transitions are GPU-accelerated and don't require JavaScript calculations
