

# Admin Dashboard Redesign Plan

## Overview
Transform the current admin dashboard from a simple card grid layout to a professional sidebar-based layout matching the reference design. This will include a persistent sidebar navigation and a comprehensive dashboard with real-time statistics.

## Current State
- Admin dashboard uses the standard `Layout` component (header + bottom nav)
- Navigation is done through cards that link to different admin sections
- No sidebar navigation exists for admin routes
- Chart components already exist (`ActivityChart`, `StatusChart`, `RevenueChart`)
- `StatisticCard` component exists for displaying statistics

## Proposed Architecture

```text
+------------------+----------------------------------------+
|   Admin Panel    |        Dashboard Overview              |
|   Hotel Mgmt     |   Real-time statistics and insights    |
+------------------+----------------------------------------+
| FRONT OFFICE     |  [Stats Cards Row 1 - 4 cards]         |
|  > Dashboard     |  Total Reservations | Messages |       |
|  > Guests        |  Current Guests | Active Events        |
|  > Rooms         +----------------------------------------+
|  > Reception     |  [Stats Cards Row 2 - 4 cards]         |
+------------------+  Service Requests | Completed |        |
| SERVICES         |  Guest Satisfaction | AI Chats         |
|  > Restaurants   +----------------------------------------+
|  > Spa           |  [3-Column Summary Cards]              |
|  > Events        |  Reservations | Today's Activity |     |
|  > Shops         |  Service Status                        |
+------------------+----------------------------------------+
| OPERATIONS       |  [Charts Section - 2 columns]          |
|  > Housekeeping  |  Monthly Visitors | Status Pie Chart   |
|  > Maintenance   |  (Line Chart)     | (Donut Chart)      |
|  > IT Support    |                                        |
+------------------+----------------------------------------+
| CONTENT          |                                        |
|  > Destinations  |                                        |
|  > About Editor  |                                        |
|  > Feedback      |                                        |
+------------------+----------------------------------------+
| [User Profile]   |                                        |
| [Logout Button]  |                                        |
+------------------+----------------------------------------+
```

## Implementation Steps

### Phase 1: Create Admin Layout Components

1. **Create `AdminLayout` Component** (`src/components/admin/AdminLayout.tsx`)
   - New layout specifically for admin pages
   - Uses `SidebarProvider` from shadcn/ui
   - Contains the admin sidebar and main content area
   - Replaces the standard `Layout` for all admin routes

2. **Create `AdminSidebar` Component** (`src/components/admin/AdminSidebar.tsx`)
   - Persistent left sidebar with grouped navigation
   - Categories: Front Office, Services, Operations, Content
   - Active route highlighting using `useLocation`
   - User profile display at the bottom with logout button
   - Collapsible on mobile (sheet drawer)
   - Logo and hotel name at top

### Phase 2: Create Dashboard Statistics Hook

3. **Create `useAdminDashboardStats` Hook** (`src/hooks/useAdminDashboardStats.tsx`)
   - Fetches real-time statistics from Supabase:
     - Total reservations (table_reservations + spa_bookings + event_reservations)
     - Messages count (from messages table)
     - Current guests (from guests table with active check-in)
     - Active events (from events table)
     - Service requests (from service_requests table)
     - Guest feedback satisfaction score
     - Conversation count
   - Includes loading states
   - Uses React Query for caching

### Phase 3: Redesign Dashboard Page

4. **Update `Dashboard.tsx`** (`src/pages/admin/Dashboard.tsx`)
   - Use new `AdminLayout` instead of `Layout`
   - Implement statistics cards matching the reference:
     - Row 1: Total Reservations, Messages, Current Guests, Active Events
     - Row 2: Service Requests, Completed Services, Guest Satisfaction, AI Conversations
   - Add summary sections:
     - Reservations Breakdown (spa, table, event counts)
     - Today's Activity (new reservations, messages, unanswered)
     - Service Status (pending, completed, average rating)
   - Include charts section:
     - Monthly Visitors line chart
     - Request Status Distribution pie chart

### Phase 4: Update All Admin Pages

5. **Update Admin Routes to use AdminLayout**
   - Modify `AdminRoutes.tsx` to wrap routes with `AdminLayout`
   - Update individual admin pages to remove `Layout` wrapper
   - All admin pages will share the sidebar navigation

### Phase 5: Enhance StatisticCard Component

6. **Enhance `StatisticCard.tsx`** (`src/components/admin/StatisticCard.tsx`)
   - Add support for colored trend indicators (green for positive, red for negative)
   - Add text-based subtitles (e.g., "0 today", "10 pending")
   - Support different icon background colors matching the reference

---

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/admin/AdminLayout.tsx` | Main layout wrapper for admin section |
| `src/components/admin/AdminSidebar.tsx` | Sidebar navigation component |
| `src/hooks/useAdminDashboardStats.tsx` | Dashboard statistics data hook |

### Files to Modify
| File | Changes |
|------|---------|
| `src/pages/admin/Dashboard.tsx` | Complete redesign with new layout and stats |
| `src/components/admin/StatisticCard.tsx` | Add colored trend and subtitle support |
| `src/routes/AdminRoutes.tsx` | Wrap with AdminLayout |
| All other admin pages | Remove Layout wrapper |

### Sidebar Navigation Structure
```text
Front Office:
  - Dashboard (/admin)
  - Guests (placeholder for future)
  - Rooms (placeholder for future)
  - Reception (placeholder for future)

Services:
  - Restaurants (/admin/restaurants)
  - Spa (/admin/spa)
  - Events (/admin/events)
  - Shops (/admin/shops)

Operations:
  - Housekeeping (/admin/housekeeping)
  - Maintenance (/admin/maintenance)
  - IT Support (/admin/information-technology)

Content:
  - Destinations (/admin/destination-admin)
  - About Editor (/admin/about)
  - Feedback (/admin/feedback)
```

### Database Queries for Statistics
```sql
-- Total Reservations (sum of all reservation types)
SELECT COUNT(*) FROM table_reservations
SELECT COUNT(*) FROM spa_bookings
SELECT COUNT(*) FROM event_reservations

-- Messages
SELECT COUNT(*) FROM messages

-- Current Guests
SELECT COUNT(*) FROM guests WHERE check_out_date >= CURRENT_DATE

-- Active Events
SELECT COUNT(*) FROM events WHERE date >= CURRENT_DATE

-- Service Requests
SELECT COUNT(*), status FROM service_requests GROUP BY status

-- Guest Satisfaction
SELECT AVG(rating) FROM guest_feedback

-- Conversations (AI Chats)
SELECT COUNT(*) FROM conversations
```

### Component Dependencies
- Uses existing shadcn/ui `Sidebar` components
- Uses existing `recharts` for charts
- Uses existing `StatisticCard` with enhancements
- Uses `useAuth` for user profile in sidebar
- Uses `react-router-dom` for navigation and active state

