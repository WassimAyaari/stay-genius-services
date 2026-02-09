
# Plan: Update Background and Card Colors

## Current State
- **Background**: `--background: 0 0% 100%` (pure white #FFFFFF)
- **Card**: `card: #FFFFFF` (pure white)
- **Result**: No visual separation between cards and background

## Desired State
- **Background**: `#f9fafb` (light gray - the light subtle background)
- **Card**: `#FFFFFF` (remain white - they stand out from the background)
- **Result**: Cards have visual depth against the light gray background

## Files to Modify

| File | Change |
|------|--------|
| `src/index.css` | Change `--background` from `0 0% 100%` to `#f9fafb` equivalent |
| `tailwind.config.ts` | No changes needed - card color already white |

## Technical Implementation

### In src/index.css (Line 18)
Convert the hex color #f9fafb to HSL format for consistency:
- #f9fafb = HSL(210, 33%, 97.6%) ≈ `210 33% 97.6%`

**Change:**
```css
/* From: */
--background: 0 0% 100%;

/* To: */
--background: 210 33% 97.6%;
```

This creates:
- Light gray background that applies to the body/main content area
- White cards that naturally stand out with subtle shadow
- Improved visual hierarchy matching the reference design
- No need to change card color - it stays #FFFFFF

## Result
The admin pages will now display:
- Light gray (#f9fafb) background for the content area
- White cards on top with proper visual separation
- Border and shadow depth makes cards readable
- Matches your reference screenshot aesthetic

## Files Affected
- `src/index.css` - 1 line change to `--background` CSS variable
