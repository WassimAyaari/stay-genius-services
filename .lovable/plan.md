
# Plan: Create Guest Management Page

## Problem Summary

The "Guests" navigation item in the admin sidebar is currently **disabled** (`disabled: true` on line 81 of `AdminSidebar.tsx`). The page doesn't exist yet. You want to display a list of hotel guests similar to the reference screenshot ("Guest 360°").

---

## Solution Overview

| Step | Action |
|------|--------|
| 1 | Enable the "Guests" navigation item in the sidebar |
| 2 | Create a new `GuestsManager.tsx` page following the reference design |
| 3 | Add the route to `AdminRoutes.tsx` |

---

## Reference Design Analysis (from screenshot)

The design includes:

| Component | Description |
|-----------|-------------|
| **Header** | "Guest 360°" title with subtitle and guest count badge |
| **Filter Cards** | 5 status filter cards: All, In-House, Arrivals, Upcoming, Departures, Past |
| **Search Bar** | Search by name, email, or room with a Refresh button |
| **Data Table** | Columns: Name, Status, Room, Check-in, Check-out, First Login, Last Logout, Email, Phone, Actions |
| **Actions** | Eye icon to view guest details |

---

## Implementation Details

### Step 1: Enable Navigation

Update `AdminSidebar.tsx` to remove `disabled: true` from the Guests item:

```typescript
// Line 81 - Change from:
{ title: 'Guests', url: '/admin/guests', icon: Users, disabled: true },

// To:
{ title: 'Guests', url: '/admin/guests', icon: Users },
```

### Step 2: Create GuestsManager Page

Create `src/pages/admin/GuestsManager.tsx` with:

**Header Section:**
- "Guest 360°" title with subtitle "Manage and view all hotel guests"
- Guest count badge in top-right corner

**Filter Cards (5 clickable cards):**

| Filter | Icon | Color | Description |
|--------|------|-------|-------------|
| All | Users | Default | Total registered guests |
| In-House | Home | Blue | Currently staying |
| Arrivals | ArrowRight | Gray | Arriving today |
| Upcoming | Calendar | Red | Future check-ins |
| Departures | ArrowLeftRight | Red | Checking out today |
| Past | Clock | Gray | Previous guests |

**Guest List Section:**
- "Guest List" card with search input
- Table with columns matching the reference:
  - Name (first + last name)
  - Status indicator
  - Room number
  - Check-in date
  - Check-out date
  - First Login (from created_at)
  - Last Logout (N/A for now)
  - Email
  - Phone
  - Actions (view details button)

**Data fetching:**
- Use Supabase to query the `guests` table
- Filter by status based on check_in_date and check_out_date
- Search functionality across name, email, and room_number

### Step 3: Add Route

Update `AdminRoutes.tsx` to include the guests route:

```typescript
import GuestsManager from '@/pages/admin/GuestsManager';

// In Routes:
<Route path="guests" element={<GuestsManager />} />
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/admin/AdminSidebar.tsx` | Remove `disabled: true` from Guests item |
| `src/pages/admin/GuestsManager.tsx` | **Create new file** with full guest management UI |
| `src/routes/AdminRoutes.tsx` | Add route for `/admin/guests` |

---

## Visual Preview

```text
┌──────────────────────────────────────────────────────────────────────┐
│  Guest 360°                                          👥 20 guests    │
│  Manage and view all hotel guests                                    │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │   All   │ │ In-House │ │ Arrivals │ │ Upcoming │ │ Departures  │  │
│  │   20    │ │    0     │ │    0     │ │    0     │ │      0      │  │
│  └─────────┘ └──────────┘ └──────────┘ └──────────┘ └─────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│  Guest List                                            20 guests     │
│  All registered guests in the system                                 │
│  ┌───────────────────────────────────────────┐  ┌─────────┐          │
│  │ 🔍 Search by name, email or room...       │  │ Refresh │          │
│  └───────────────────────────────────────────┘  └─────────┘          │
├───────────────────────────────────────────────────────────────────────┤
│ Name        │Status│ Room │Check-in│Check-out│First Login│Email│Action│
├───────────────────────────────────────────────────────────────────────┤
│ te tt       │  —   │ 442  │05/02/26│11/02/26 │05/02/2026 │test@│  👁  │
│ Sofia Sofiy │  —   │ —    │  N/A   │  N/A    │10/06/2025 │wass@│  👁  │
│ Nora Nora   │  —   │ 206  │10/06/25│26/06/25 │10/06/2025 │nour@│  👁  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Technical Details

### Database Query

```typescript
const { data, error } = await supabase
  .from('guests')
  .select('*')
  .order('created_at', { ascending: false });
```

### Status Filtering Logic

| Filter | Condition |
|--------|-----------|
| All | No filter (all guests) |
| In-House | `check_in_date <= today AND check_out_date >= today` |
| Arrivals | `check_in_date = today` |
| Upcoming | `check_in_date > today` |
| Departures | `check_out_date = today` |
| Past | `check_out_date < today` |

### Key Components Used

- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` from ui/table
- `Card`, `CardContent`, `CardHeader`, `CardTitle` from ui/card
- `Input` for search
- `Button` for refresh and actions
- `Badge` for guest count
- Lucide icons: `Users`, `Home`, `ArrowRight`, `Calendar`, `ArrowLeftRight`, `Clock`, `Eye`, `Search`, `RefreshCw`

---

## Summary

This implementation will:
1. Enable the Guests navigation in the admin sidebar
2. Create a polished guest management page matching the reference design
3. Display all hotel guests with filtering and search capabilities
4. Allow hotel managers to view and manage their guest database
5. Follow existing code patterns and UI components from other admin pages
