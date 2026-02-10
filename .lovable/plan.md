
# Fix Layout Shift When Opening Select Dropdowns

## Problem

When clicking the "Tous les restaurants" or "Tous les statuts" dropdown, the Radix Select component is **modal by default** -- it hides the page scrollbar while open. This causes the entire page content (sidebar, table) to shift horizontally by the scrollbar width (~8px).

## Solution

Add `modal={false}` to both `SelectContent` components in `RestaurantBookingsTab.tsx`. This prevents Radix from removing the body scrollbar when the dropdown is open, eliminating all layout shifts.

## Changes

### File: `src/pages/admin/restaurants/RestaurantBookingsTab.tsx`

- Line 80: Change `<SelectContent>` to `<SelectContent modal={false}>`
- Line 94: Change `<SelectContent>` to `<SelectContent modal={false}>`

That's it -- two small prop additions, no other changes needed.
