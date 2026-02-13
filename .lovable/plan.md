

# Add Section Icons to All Admin Page Headers

## Overview
Add a styled icon container (matching the Staff Management pattern) to every admin page header. Each page will get a relevant icon displayed in a rounded container with a primary tint background, consistent with the existing design.

## Icon Assignments

| Page | Icon | Title |
|------|------|-------|
| Dashboard | `LayoutDashboard` | Dashboard Overview |
| Guest 360 | `Users` | Guest 360 |
| Feedback | `MessageSquare` | Gestion des Feedbacks |
| Housekeeping | `Trash2` | Housekeeping Management |
| Maintenance | `Wrench` | Maintenance & Technical Items |
| Security | `Shield` | Security Management |
| IT Support | `Wifi` | Information Technology Management |
| Restaurants | `Utensils` | Restaurant Management |
| Spa | `Sparkles` | Spa Management |
| Events | `PartyPopper` | Gestion des Evenements |
| Shops | `Store` | Shop Management |
| Destinations | `MapPin` | Administration - Destination |
| About Editor | `FileText` | About Page Editor |
| Demo Settings | `Settings` | Demo Settings |
| Staff Management | Already done | -- |

## Pattern Applied
Each header will follow the Staff Management pattern:

```tsx
<div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
    <IconComponent className="h-5 w-5 text-primary" />
  </div>
  <div>
    <h1 className="text-2xl font-bold tracking-tight">Page Title</h1>
    <p className="text-sm text-muted-foreground">Subtitle text</p>
  </div>
</div>
```

## Files to Modify (14 files)
1. `src/pages/admin/Dashboard.tsx` - LayoutDashboard icon
2. `src/pages/admin/GuestsManager.tsx` - Users icon
3. `src/pages/admin/FeedbackManager.tsx` - MessageSquare icon
4. `src/pages/admin/HousekeepingManager.tsx` - Trash2 icon
5. `src/pages/admin/MaintenanceManager.tsx` - Wrench icon
6. `src/pages/admin/SecurityManager.tsx` - Shield icon
7. `src/pages/admin/InformationTechnologyManager.tsx` - Wifi icon
8. `src/pages/admin/RestaurantManager.tsx` - Utensils icon
9. `src/pages/admin/SpaManager.tsx` - Sparkles icon
10. `src/pages/admin/EventsManager.tsx` - PartyPopper icon
11. `src/pages/admin/ShopsManager.tsx` - Store icon
12. `src/pages/admin/DestinationAdmin.tsx` - MapPin icon
13. `src/pages/admin/AboutEditor.tsx` - FileText icon
14. `src/pages/admin/DemoManager.tsx` - Settings icon

Each file will have its `<h1>` header section wrapped with the icon container pattern, importing the appropriate Lucide icon. The subtitle text will be preserved where it already exists, or a short descriptive one added where missing.

