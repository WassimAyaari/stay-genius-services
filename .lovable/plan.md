

# Make Guest 360 Filter Cards Visually Colorful

## Problem
The pastel colors were only applied to the small icon circle inside each card, making them barely noticeable. The entire card needs a pastel background to create the vibrant, colorful look requested.

## Solution
Apply pastel background colors to the entire card, and use matching darker icon colors. This will make each card visually distinct and lively.

## Color Scheme

| Card | Card Background | Icon Color |
|------|----------------|------------|
| All | `bg-violet-50 border-violet-200` | `text-violet-600` |
| In-House | `bg-blue-50 border-blue-200` | `text-blue-600` |
| Arrivals | `bg-green-50 border-green-200` | `text-green-600` |
| Upcoming | `bg-amber-50 border-amber-200` | `text-amber-600` |
| Departures | `bg-rose-50 border-rose-200` | `text-rose-600` |
| Past | `bg-slate-50 border-slate-200` | `text-slate-500` |

## Changes

**File: `src/pages/admin/GuestsManager.tsx`**

1. Add a `cardBgClass` property to the `FilterCard` interface for the card-level background
2. Update each filter card with card background + border color classes
3. Apply the card background class to the `<Card>` component itself (not just the icon circle)
4. Keep the icon circle with a slightly stronger tint (e.g. `bg-violet-100` instead of `bg-violet-50`) so the icon still pops against the card background

This way, the entire card will be tinted with a pastel color, making the interface visually vibrant and each category instantly distinguishable.

