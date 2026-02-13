
# Change Cancelled Status Color to #f4b5ac

## Problem
The "Cancelled" status badge currently uses a neutral gray color (`bg-gray-100 text-gray-800`), which doesn't provide sufficient visual distinction from pending statuses. The user wants a more distinct pinkish/salmon color (`#f4b5ac`) for cancelled requests.

## Solution
Update the `getStatusBadgeColor` function in all four request tab components to apply the custom color `#f4b5ac` for cancelled status badges.

Since `#f4b5ac` is a light salmon/pink color, we'll also need to set an appropriate dark text color for readability. Using `#8b3a34` (a dark brown/red) will provide good contrast.

## Implementation Details

### Changed Logic
Replace the cancelled case in each `getStatusBadgeColor` function:

**Current (all 4 files):**
```tsx
case 'cancelled':
  return 'bg-gray-100 text-gray-800 border-gray-200';
```

**Change to (with inline style approach):**
Instead of using Tailwind classes for the custom color, we'll apply inline styles to the Badge component since `#f4b5ac` is not a standard Tailwind color.

The Badge components already support the `style` prop, so we can conditionally apply:
- `backgroundColor: '#f4b5ac'`
- `color: '#8b3a34'` (dark text for contrast)

### Files to Modify
1. `src/pages/admin/maintenance/components/MaintenanceRequestsTab.tsx` - Update `getStatusBadgeColor` and Badge rendering (lines 52-53 and ~145-150)
2. `src/pages/admin/housekeeping/components/HousekeepingRequestsTab.tsx` - Update `getStatusBadgeColor` and Badge rendering (lines 63-64)
3. `src/pages/admin/security/SecurityRequestsTab.tsx` - Update `getStatusBadgeColor` and Badge rendering (lines 52-53 and ~145-150)
4. `src/pages/admin/information-technology/components/InformationTechnologyRequestsTab.tsx` - Update `getStatusBadgeColor` and Badge rendering (lines 61-62)

### Implementation Approach
For each file, we'll:
1. Update the `getStatusBadgeColor` function to return a special marker for cancelled (e.g., `'cancelled'`)
2. Apply the custom inline style directly in the Badge component using a ternary conditional

Example pattern:
```tsx
<Badge
  className={request.status === 'cancelled' ? '' : `${getStatusBadgeColor(request.status)} border`}
  variant="outline"
  style={request.status === 'cancelled' ? { 
    backgroundColor: '#f4b5ac', 
    color: '#8b3a34',
    border: '1px solid #e8a39f'
  } : undefined}
>
  {getStatusLabel(request.status)}
</Badge>
```

Alternatively, we can simplify by always returning a style object from `getStatusBadgeColor` or by checking the status directly in the Badge rendering.
