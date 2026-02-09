

# Plan: Guest 360° Detail Panel

## Overview

When clicking the Eye icon on a guest row in the Guest Manager, a slide-out Sheet panel will open displaying comprehensive guest information organized into four cards plus a top status bar, matching the detailed interface you described.

---

## Architecture

The implementation will add a Sheet-based detail panel that opens when clicking a guest row. The panel fetches all related data for that guest.

| Component | Purpose |
|-----------|---------|
| `GuestDetailSheet.tsx` | Main container with Sheet and data fetching |
| `GuestStayContextBar.tsx` | Top status bar showing live stay context |
| `GuestProfileCard.tsx` | Card 1: Core profile, identity, loyalty |
| `GuestPreferencesCard.tsx` | Card 2: Interactive preference tags |
| `GuestActivityCard.tsx` | Card 3: Requests, F&B orders, complaints history |
| `GuestIntelligenceCard.tsx` | Card 4: Alerts, guest value, staff notes |

---

## Visual Layout

```text
+-------------------------------------------------------------+
| [X]  GUEST 360°                                             |
+-------------------------------------------------------------+
|  ┌─────────────────────────────────────────────────────────┐|
|  │ [IN-HOUSE]  Jan 10 - Jan 15 (5 Nights)                  ||
|  │ Room #302 (Junior Suite)  •  2 Adults, 1 Child          ||
|  │ Reservation ID: #HG-98442                               ||
|  └─────────────────────────────────────────────────────────┘|
+-------------------------------------------------------------+
|                                                             |
|  ┌──────────────────────────────────────────────────────┐   |
|  │ CORE PROFILE & LOYALTY                               │   |
|  │ ┌──────┐  John Smith                                 │   |
|  │ │Avatar│  john@email.com • +1 555-0123               │   |
|  │ └──────┘  Born: Jan 15, 1985 • Anniversary: Jun 20   │   |
|  │                                                       │   |
|  │ Loyalty: #LY-12345 • 2,450 pts                       │   |
|  │ Total Stays: 3 • Favorite Room: 104                  │   |
|  └──────────────────────────────────────────────────────┘   |
|                                                             |
|  ┌──────────────────────────────────────────────────────┐   |
|  │ PREFERENCES (The DNA)                      [Edit]    │   |
|  │ ┌─────────────┐ ┌────────────┐ ┌──────────────┐      │   |
|  │ │ High Floor  │ │ King Bed   │ │ No Smoking   │      │   |
|  │ └─────────────┘ └────────────┘ └──────────────┘      │   |
|  │ ┌───────────────┐ ┌────────────────┐                 │   |
|  │ │ Extra Pillows │ │ Quiet Room     │                 │   |
|  │ └───────────────┘ └────────────────┘                 │   |
|  └──────────────────────────────────────────────────────┘   |
|                                                             |
|  ┌──────────────────────────────────────────────────────┐   |
|  │ ACTIVITY & MEMORY                                    │   |
|  │ ├─ Requests ────────────────────────────────────────││   |
|  │ │  • Iron - Completed - Jul 8                       ││   |
|  │ │  • Late Checkout - Pending - Jul 9                ││   |
|  │ ├─ F&B Orders ──────────────────────────────────────││   |
|  │ │  • Room Service - Breakfast - Jul 8               ││   |
|  │ ├─ Past Issues ─────────────────────────────────────││   |
|  │ │  • A/C not working (resolved)                     ││   |
|  └──────────────────────────────────────────────────────┘   |
|                                                             |
|  ┌──────────────────────────────────────────────────────┐   |
|  │ INTELLIGENCE & ALERTS                                │   |
|  │ ┌────────────────────────────────────────────────┐   │   |
|  │ │ !!! ALLERGIC TO PEANUTS !!!                    │   │   |
|  │ └────────────────────────────────────────────────┘   │   |
|  │ [HIGH-VALUE GUEST]  [TOP SPENDER]                    │   |
|  │                                                       │   |
|  │ ┌── Staff Notes ───────────────────────────────────┐ │   |
|  │ │ Prefers sparkling water over still               │ │   |
|  │ │ Always requests room away from elevator          │ │   |
|  │ └──────────────────────────────────────────────────┘ │   |
|  └──────────────────────────────────────────────────────┘   |
+-------------------------------------------------------------+
```

---

## Data Sources

### Current Database Tables

| Data | Source Table | Fields Used |
|------|--------------|-------------|
| Guest Info | `guests` | All fields |
| Companions | `companions` | Where `user_id` matches |
| Room Details | `rooms` | Join on `room_number` |
| Service Requests | `service_requests` | Where `guest_id` or `room_number` matches |
| Dining Reservations | `table_reservations` | Where `user_id` or `guest_email` matches |
| Spa Bookings | `spa_bookings` | Where `user_id` or `guest_email` matches |
| Event Reservations | `event_reservations` | Where `user_id` or `guest_email` matches |

### New Database Tables Required

To support all the features in your design, the following new tables will need to be created:

| Table | Purpose | Columns |
|-------|---------|---------|
| `guest_preferences` | Store preference tags | `id`, `guest_id`, `preference`, `created_at`, `updated_at` |
| `guest_allergies` | Medical alerts | `id`, `guest_id`, `allergy`, `severity`, `created_at` |
| `guest_notes` | Staff-to-staff notes | `id`, `guest_id`, `note`, `created_by`, `created_at` |
| `guest_loyalty` | Loyalty info | `id`, `guest_id`, `membership_number`, `points`, `tier` |

---

## Implementation Details

### File 1: GuestDetailSheet.tsx

Main container component that:
- Receives `guest` object and `isOpen` state
- Fetches related data (companions, room, requests, reservations)
- Uses Sheet component sliding from right
- Contains ScrollArea for content

```typescript
interface GuestDetailSheetProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
}
```

### File 2: GuestStayContextBar.tsx

The highlighted top bar showing:
- Status badge: `[IN-HOUSE]`, `[ARRIVING TODAY]`, `[DEPARTING]`, `[UPCOMING]`, `[PAST]`
- Stay dates with nights calculation
- Room number with room type (from rooms table)
- Occupancy (from companions count + 1)
- Reservation ID (use guest.id truncated)

Color coding:
- In-House: Blue background
- Arriving Today: Green background  
- Departing: Orange background
- Upcoming: Gray background
- Past: Muted background

### File 3: GuestProfileCard.tsx

Core Profile & Loyalty card:
- Avatar (from profile_image or initials fallback)
- Full name, email, phone
- Birth date, nationality
- Guest type badge
- Created date (as "Member since")
- Companions list with relations

Since loyalty table doesn't exist yet, show placeholder or skip loyalty section.

### File 4: GuestPreferencesCard.tsx

Interactive preference bubbles/tags:
- Initially empty (no preferences table yet)
- "Edit" button to add preferences
- Tags displayed as interactive badges
- Will show "No preferences recorded" placeholder

### File 5: GuestActivityCard.tsx

Activity & Memory hub with tabs:
- **Requests Tab**: List from `service_requests`
- **F&B Tab**: Dining reservations from `table_reservations` 
- **Spa Tab**: Bookings from `spa_bookings`
- **Events Tab**: Reservations from `event_reservations`

Each item shows:
- Description/name
- Status badge (completed, pending, cancelled)
- Date

### File 6: GuestIntelligenceCard.tsx

Intelligence & Alerts:
- Medical alerts section (placeholder - no allergies table)
- Guest value badges based on stay count or guest_type
- Staff notes area (placeholder - no notes table)

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/pages/admin/GuestsManager.tsx` | Modify | Add state for selected guest and sheet open state |
| `src/pages/admin/components/guests/GuestDetailSheet.tsx` | Create | Main sheet container |
| `src/pages/admin/components/guests/GuestStayContextBar.tsx` | Create | Top status bar |
| `src/pages/admin/components/guests/GuestProfileCard.tsx` | Create | Profile & loyalty card |
| `src/pages/admin/components/guests/GuestPreferencesCard.tsx` | Create | Preferences card |
| `src/pages/admin/components/guests/GuestActivityCard.tsx` | Create | Activity history card |
| `src/pages/admin/components/guests/GuestIntelligenceCard.tsx` | Create | Alerts & notes card |
| `src/pages/admin/components/guests/types.ts` | Create | Shared types |

---

## Database Migrations (Future Enhancement)

To fully implement all features, these tables should be created:

```sql
-- Guest Preferences
CREATE TABLE guest_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  preference TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Guest Allergies / Medical Alerts
CREATE TABLE guest_allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  allergy TEXT NOT NULL,
  severity TEXT DEFAULT 'medium', -- low, medium, high
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Staff Notes
CREATE TABLE guest_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Components Used

- `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` - Slide-out panel
- `ScrollArea` - Scrollable content
- `Card`, `CardContent`, `CardHeader`, `CardTitle` - Section cards
- `Badge` - Status indicators and tags
- `Avatar`, `AvatarImage`, `AvatarFallback` - Guest photo
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` - Activity sections
- `Separator` - Visual dividers
- `Button` - Actions (Edit, Add preference)
- `Textarea` - Staff notes input
- Icons: `User`, `Phone`, `Mail`, `Calendar`, `AlertTriangle`, `Star`, `StickyNote`, `Utensils`, `Sparkles`, `CalendarDays`

---

## Technical Notes

### Query Strategy

Use React Query to fetch related data when sheet opens:

```typescript
const { data: roomDetails } = useQuery({
  queryKey: ['room', guest?.room_number],
  queryFn: async () => {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_number', guest.room_number)
      .single();
    return data;
  },
  enabled: !!guest?.room_number
});

const { data: serviceRequests } = useQuery({
  queryKey: ['guest-requests', guest?.id],
  queryFn: async () => {
    const { data } = await supabase
      .from('service_requests')
      .select('*, request_items(*)')
      .or(`guest_id.eq.${guest.id},guest_id.eq.${guest.user_id}`)
      .order('created_at', { ascending: false });
    return data;
  },
  enabled: !!guest
});
```

### Status Calculation

Reuse the existing `getGuestStatus` function from GuestsManager to determine the status badge.

### Nights Calculation

```typescript
const calculateNights = (checkIn: string, checkOut: string) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};
```

---

## Summary

This implementation will create a comprehensive Guest 360° detail panel that:

1. Opens as a slide-out sheet when clicking the eye icon on any guest
2. Shows live stay context at the top with status, dates, room info, and occupancy
3. Displays core profile information with photo and contact details
4. Shows preferences as interactive tags (with placeholder for future data)
5. Lists all guest activity: requests, dining, spa, and event reservations
6. Highlights medical alerts and provides staff notes area (with placeholders for future tables)

The current implementation will use existing tables and show appropriate placeholders where new tables would be needed. Future enhancements can add the preference, allergy, and notes tables for complete functionality.

