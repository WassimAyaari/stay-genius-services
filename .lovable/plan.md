
# Plan: Redesign Events Page Like Gastronomy

## Problem Summary

Two issues are preventing the events from displaying:

1. **Date filtering**: All events in the database have dates in 2025, but the current date is February 2026. The `upcomingEvents` filter excludes past events, resulting in an empty list.

2. **UI design**: The current Events page has a complex structure with Stories, Carousels, multiple sections, etc. You want a simpler design like the Gastronomy (Dining) page: clean cards with event info and a "Book" button.

---

## Solution

### Part 1: Use All Events (Not Just Upcoming)

Modify the Events page to use `events` instead of `upcomingEvents` from the hook. This will show all events from the database regardless of date.

**File:** `src/pages/events/Events.tsx`

Change from:
```typescript
const { upcomingEvents: events, loading } = useEvents();
```

To:
```typescript
const { events, loading } = useEvents();
```

---

### Part 2: Redesign Events Page Like Gastronomy

Create a simplified Events page following the Gastronomy design pattern:

**New structure:**
- Header with title and description
- Grid of event cards (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each card shows: image, title, date/time, location, description, "Book" button

**File:** `src/pages/events/Events.tsx`

```text
Layout
+-----------------------------------------------+
|  Events & Promotions (title)                  |
|  Discover our special events (subtitle)       |
+-----------------------------------------------+
|  +--------+  +--------+  +--------+           |
|  | Image  |  | Image  |  | Image  |           |
|  | Title  |  | Title  |  | Title  |           |
|  | Date   |  | Date   |  | Date   |           |
|  | Time   |  | Time   |  | Time   |           |
|  | Loc    |  | Loc    |  | Loc    |           |
|  | [Book] |  | [Book] |  | [Book] |           |
|  +--------+  +--------+  +--------+           |
+-----------------------------------------------+
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/events/Events.tsx` | Complete redesign to match Gastronomy page style |

---

## Implementation Details

The new Events page will:

1. **Remove complex components**: No more Stories, StoryCarousel, PromotionList, NewsletterSection, EventHeader
2. **Use simple card grid**: Like Gastronomy, display events in a responsive grid
3. **Show all events**: Use `events` instead of `upcomingEvents`
4. **Each card contains**:
   - Event image
   - Event title
   - Date and time (with icons)
   - Location (with icon)
   - Capacity (with icon)
   - Description
   - "Book" button that opens the booking dialog
   - "View Details" button (optional)

5. **Handle empty state**: Show a friendly message if no events exist
6. **Loading state**: Show skeleton cards while loading

---

## Expected Result

After this change:
1. The Events page will display all events from the database in a clean card grid
2. Each event shows its details (image, title, date, time, location)
3. Users can click "Book" to open the booking dialog for any event
4. The design matches the Gastronomy page style - clean and simple
