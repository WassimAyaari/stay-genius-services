

# Fix: Lighter Colors for Preferences & Medical Alerts

## Problem
The medical alert card for "Low" severity appears with a dark navy background because it maps to `bg-secondary` which is `#2C3E50`. The preference chips also use the dark `secondary` variant.

## Changes

### File: `src/pages/profile/components/PreferencesSection.tsx`

**1. Update severity color mapping** -- replace the dark backgrounds with soft, light pastels:

| Severity | Current | New |
|----------|---------|-----|
| Critical | `bg-destructive/15 text-destructive` | Keep as-is (red tint is appropriate) |
| High | `bg-destructive/10 text-destructive` | Keep as-is |
| Medium | `bg-orange-100 text-orange-800` | Keep as-is |
| Low | `bg-secondary text-secondary-foreground` | `bg-blue-50 text-blue-800 border-blue-200` |

**2. Update preference badge styling** -- change from the dark `secondary` variant to a lighter style using `className` override with soft teal/primary tones (`bg-primary/10 text-primary border-primary/20`) to match the app's teal color scheme.

## Result
All cards and chips will have light pastel backgrounds with readable dark text instead of dark navy backgrounds with white text.

