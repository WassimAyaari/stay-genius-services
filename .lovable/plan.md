

# Add Pastel Colors to Guest 360 Filter Cards

## What Changes
Update the `filterCards` array in `GuestsManager.tsx` to give each card a distinct light pastel color for both the icon background and icon color, making the interface more vibrant.

## Color Assignments

| Card | Icon BG | Icon Color |
|------|---------|------------|
| All | `bg-violet-50` | `text-violet-600` |
| In-House | `bg-blue-50` | `text-blue-600` |
| Arrivals | `bg-green-50` | `text-green-600` |
| Upcoming | `bg-amber-50` | `text-amber-600` |
| Departures | `bg-rose-50` | `text-rose-600` |
| Past | `bg-slate-100` | `text-slate-500` |

## File to Modify
- `src/pages/admin/GuestsManager.tsx` -- update the `colorClass` and `bgClass` values in the `filterCards` array (lines 42-49)

