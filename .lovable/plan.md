

# Dark Mode + New Color Palette + Admin Mobile Redesign

## What This Plan Covers

This plan implements three things:
1. A complete Light/Dark mode toggle system using the color palette you provided
2. Updated colors across the entire app (guest side and admin side)
3. A redesigned admin dashboard optimized for mobile with compact 2-column card layouts

---

## Part 1: Dark Mode System

### How It Works
The app already has `next-themes` installed but is not using it. We will wire it up using the standard `ThemeProvider` from `next-themes`, which adds a `.dark` class to the HTML element. Tailwind then uses that class to switch CSS variables.

### Changes

**New file: `src/components/ThemeProvider.tsx`**
- Wraps the app with `next-themes` ThemeProvider
- Provides `useTheme()` hook for toggling

**New file: `src/components/ThemeToggle.tsx`**
- A Sun/Moon icon button that toggles between light and dark mode
- Will be placed in both the admin sidebar footer and the guest header

**Modified: `src/index.css`**
- Replace the current `:root` variables with your Light Mode palette
- Add a `.dark` selector block with your Dark Mode palette
- Remove hardcoded `!important` background/color overrides on inputs, buttons, etc. that would fight the dark mode

The new CSS variables:

```text
:root (Light Mode)
  --background: 240 10% 98%         (#fafafa)
  --foreground: 222.2 84% 4.9%      (#020817)
  --primary: 150 25% 58%            (#79AF94)
  --primary-foreground: 210 40% 98% (#f8fafc)
  --secondary: 210 40% 96.1%        (#f1f5f9)
  --secondary-foreground: 222.2 47.4% 11.2% (#0f172a)
  --card: 0 0% 100%                 (#ffffff)
  --card-foreground: 222.2 84% 4.9%
  --muted: 210 40% 96.1%
  --muted-foreground: 215.4 16.3% 46.9%
  --border: 214.3 31.8% 91.4%       (#e2e8f0)
  --destructive: 0 84.2% 60.2%      (#f87171)
  --ring: 150 25% 58%

.dark (Dark Mode)
  --background: 20 14.3% 4.1%       (#09090b)
  --foreground: 0 0% 95%            (#f2f2f2)
  --primary: 150 25% 58%            (#79AF94) -- same green
  --primary-foreground: 20 14.3% 4.1% (#09090b)
  --secondary: 240 3.7% 15.9%       (#27272a)
  --secondary-foreground: 0 0% 98%  (#fafafa)
  --card: 240 3.7% 15.9%            (#27272a)
  --card-foreground: 0 0% 95%
  --muted: 0 0% 15%                 (#262626)
  --muted-foreground: 240 5% 64.9%  (#a1a1aa)
  --border: 240 3.7% 15.9%          (#27272a)
  --destructive: 0 62.8% 30.6%      (#7f1d1d)
  --ring: 150 25% 58%
```

**Modified: `tailwind.config.ts`**
- Add `darkMode: "class"` to enable Tailwind's class-based dark mode
- Update the hardcoded `primary` color from `#00AFB9` to `#79AF94`
- Update `card` and `secondary` color references to use CSS variables instead of hardcoded values

**Modified: `src/App.tsx`**
- Wrap the app with `ThemeProvider` (defaultTheme="light", storageKey="hotel-genius-theme")

**Modified: `src/components/admin/AdminSidebar.tsx`**
- Add `ThemeToggle` button in the sidebar footer (next to language selector)

**Modified: `src/components/Layout.tsx` (guest header)**
- Add `ThemeToggle` button in the header right section (next to notifications)

**Modified: `src/components/ui/sidebar.tsx`**
- Update `SidebarInset` background from hardcoded `bg-[#f9fafb]` to `bg-background` so it respects dark mode

**Modified: `src/components/ui/sonner.tsx`**
- Change from hardcoded `theme="light"` to use the current theme from `useTheme()`

---

## Part 2: Admin Dashboard Mobile Redesign

Currently, the dashboard uses `grid-cols-1` on mobile (full-width cards) which wastes space. The redesign will make it compact and touch-friendly.

### Changes to `src/pages/admin/Dashboard.tsx`

**Header (mobile)**
- Smaller icon (h-8 w-8), smaller title (text-xl), hide subtitle on mobile

**Stats cards grid**
- Change from `grid gap-4 md:grid-cols-2 lg:grid-cols-4` to `grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4`
- This gives 2 cards per row on mobile instead of 1

**Summary cards grid**
- Change from `grid gap-4 md:grid-cols-3` to `grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3`
- On small phones: 1 column; on larger phones: 2 columns; on desktop: 3 columns

**Charts section**
- Change from `grid gap-4 md:grid-cols-2` to `grid grid-cols-1 gap-3 md:grid-cols-2`
- Full width charts on mobile

**Overall padding**
- Reduce from `p-6` to `p-3 sm:p-4 md:p-6` on mobile
- Reduce gap from `space-y-6` to `space-y-4 md:space-y-6`

### Changes to `src/components/admin/StatisticCard.tsx`

**Mobile-compact layout**
- Reduce padding from `p-5` to `p-3 sm:p-5`
- Reduce value font size from `text-2xl` to `text-lg sm:text-2xl`
- Reduce icon circle from `h-10 w-10` to `h-8 w-8 sm:h-10 sm:w-10`
- Reduce icon from `h-5 w-5` to `h-4 w-4 sm:h-5 sm:w-5`
- Title font size: `text-xs sm:text-sm`

### Changes to chart components

**`src/components/admin/charts/ActivityChart.tsx`**
- Reduce chart height from `h-[250px]` to `h-[180px] sm:h-[250px]` on mobile

**`src/components/admin/charts/StatusChart.tsx`**
- Same height reduction for mobile

---

## Part 3: Guest Side Mobile Polish

**Modified: `src/components/BottomNav.tsx`**
- Update colors to use new primary (#79AF94) -- already uses `text-primary` so it will update automatically via CSS variables

**Modified: `src/components/MainMenu.tsx`**
- The sheet menu already uses semantic color classes (`bg-card`, `text-card-foreground`) so it will adapt to dark mode automatically

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/components/ThemeProvider.tsx` | Create | next-themes wrapper |
| `src/components/ThemeToggle.tsx` | Create | Sun/Moon toggle button |
| `src/index.css` | Modify | New light + dark CSS variables |
| `tailwind.config.ts` | Modify | Add darkMode: "class", update primary color |
| `src/App.tsx` | Modify | Wrap with ThemeProvider |
| `src/components/admin/AdminSidebar.tsx` | Modify | Add theme toggle in footer |
| `src/components/Layout.tsx` | Modify | Add theme toggle in guest header |
| `src/components/ui/sidebar.tsx` | Modify | Replace hardcoded bg color |
| `src/components/ui/sonner.tsx` | Modify | Dynamic theme |
| `src/pages/admin/Dashboard.tsx` | Modify | 2-col mobile grid, compact spacing |
| `src/components/admin/StatisticCard.tsx` | Modify | Compact mobile card sizes |
| `src/components/admin/charts/ActivityChart.tsx` | Modify | Smaller mobile chart height |
| `src/components/admin/charts/StatusChart.tsx` | Modify | Smaller mobile chart height |

## Implementation Order
1. Create ThemeProvider and ThemeToggle components
2. Update `index.css` with new light/dark palettes
3. Update `tailwind.config.ts` with darkMode and new primary color
4. Wrap App with ThemeProvider
5. Fix `sidebar.tsx` hardcoded background
6. Add ThemeToggle to admin sidebar and guest header
7. Redesign dashboard grid for mobile (2-col layout, compact cards)
8. Update chart heights for mobile
9. Test both modes on mobile and desktop

