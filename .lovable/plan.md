

# Plan: Convert Guest 360° from Sidebar to Full Page

## Overview

Transform the current Sheet-based (sidebar) Guest 360° detail view into a dedicated full-page experience at `/admin/guests/:guestId`. When clicking the eye icon, users will be navigated to this new page instead of opening a sidebar.

---

## Reference Design Analysis

Based on the screenshot provided, the layout features:

| Section | Description |
|---------|-------------|
| **Header** | "Back to guests" link + Guest name + "360° Guest View" subtitle + Status badge |
| **Context Bar** | Room info, guest type, and occupancy displayed inline below name |
| **2-Column Grid** | Cards arranged in a 2-column layout on larger screens |
| **Left Column** | Profile & Loyalty card, Activity & Memory card |
| **Right Column** | Preferences (Guest DNA) card, Intelligence & Alerts card |

---

## Visual Layout

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Back to guests                                        [NO STAY/STATUS]│
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Jonathan Underwood                                                      │
│  360° Guest View                                                         │
│  📅 -.-.—  🏠 Room #000 (Standard Guest)  👥 1 Adult                     │
│                                                                          │
├─────────────────────────────────┬────────────────────────────────────────┤
│                                 │                                        │
│  ┌───────────────────────────┐  │  ┌────────────────────────────────┐   │
│  │ Profile & Loyalty         │  │  │ Preferences (Guest DNA)  [+Add]│   │
│  │                           │  │  │                                │   │
│  │ IDENTITY                  │  │  │ ROOM                           │   │
│  │ 👤 Jonathan Underwood     │  │  │ No preferences                 │   │
│  │ 📧 jwru70@gmail.com       │  │  │                                │   │
│  │                           │  │  │ DINING                         │   │
│  │ ACCOUNT ACTIVITY          │  │  │ No preferences                 │   │
│  │ ➡️ First Login: 07 Feb 2026│  │  │                                │   │
│  │                           │  │  │ SERVICE                        │   │
│  │ LOYALTY                   │  │  │ No preferences                 │   │
│  │ Membership Number: —      │  │  └────────────────────────────────┘   │
│  │ Membership Level: —       │  │                                        │
│  └───────────────────────────┘  │  ┌────────────────────────────────┐   │
│                                 │  │ Intelligence & Alerts  [Alert] │   │
│  ┌───────────────────────────┐  │  │                        [Note]  │   │
│  │ Activity & Memory         │  │  │                                │   │
│  │                           │  │  │ ACTIVE ALERTS                  │   │
│  │ SERVICE REQUESTS          │  │  │ No active alerts               │   │
│  │ No requests recorded      │  │  │                                │   │
│  │                           │  │  │ STAFF-TO-STAFF NOTES           │   │
│  │ DINING RESERVATIONS       │  │  │ No notes                       │   │
│  │ No reservations recorded  │  │  │                                │   │
│  │                           │  │  │ [+ Add a note]                 │   │
│  │ PREVIOUS ISSUES           │  │  └────────────────────────────────┘   │
│  │ No complaints             │  │                                        │
│  └───────────────────────────┘  │                                        │
│                                 │                                        │
└─────────────────────────────────┴────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Create Guest Detail Page

Create a new page component `GuestDetailPage.tsx` that:
- Uses `useParams` to get the guest ID from the URL
- Fetches guest data and all related information
- Displays the content in a full-page layout with 2-column grid
- Includes a "Back to guests" navigation link

### Step 2: Add Route

Update `AdminRoutes.tsx` to add the new route:
```typescript
<Route path="guests/:guestId" element={<GuestDetailPage />} />
```

### Step 3: Update GuestsManager Navigation

Modify the eye icon click handler in `GuestsManager.tsx` to navigate to the detail page instead of opening a sheet:
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const handleViewGuest = (guest: Guest) => {
  navigate(`/admin/guests/${guest.id}`);
};
```

Remove the Sheet-related state and component.

### Step 4: Enhance Card Components

Update the existing card components to work better in a full-page layout:
- Adjust `GuestPreferencesCard` to show categories (Room, Dining, Service)
- Update `GuestActivityCard` to use vertical sections instead of tabs for better visibility
- Enhance `GuestIntelligenceCard` with Alert/Note action buttons in header

### Step 5: Create Page Header Component

Create a new `GuestPageHeader.tsx` component for the header section with:
- Back navigation link
- Guest name and subtitle
- Status badge (right-aligned: "NO STAY", "IN-HOUSE", etc.)
- Context bar with room info, guest type, and occupancy

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/pages/admin/GuestDetailPage.tsx` | **Create** | New full-page guest detail view |
| `src/pages/admin/components/guests/GuestPageHeader.tsx` | **Create** | Page header with back link, name, status |
| `src/routes/AdminRoutes.tsx` | **Modify** | Add route for `/admin/guests/:guestId` |
| `src/pages/admin/GuestsManager.tsx` | **Modify** | Change eye icon to navigate instead of open sheet |
| `src/pages/admin/components/guests/GuestPreferencesCard.tsx` | **Modify** | Add category sections (Room, Dining, Service) |
| `src/pages/admin/components/guests/GuestActivityCard.tsx` | **Modify** | Convert to vertical sections layout |
| `src/pages/admin/components/guests/GuestIntelligenceCard.tsx` | **Modify** | Add Alert/Note buttons to header |
| `src/pages/admin/components/guests/GuestProfileCard.tsx` | **Modify** | Update layout for Account Activity section |
| `src/pages/admin/components/guests/GuestDetailSheet.tsx` | **Delete** | No longer needed |

---

## Technical Details

### New Page Component Structure

```typescript
// GuestDetailPage.tsx
const GuestDetailPage: React.FC = () => {
  const { guestId } = useParams<{ guestId: string }>();
  const navigate = useNavigate();
  
  // Fetch guest data
  const { data: guest, isLoading } = useQuery({
    queryKey: ['guest', guestId],
    queryFn: async () => {
      const { data } = await supabase
        .from('guests')
        .select('*')
        .eq('id', guestId)
        .single();
      return data;
    },
    enabled: !!guestId,
  });
  
  // ... other queries for related data
  
  return (
    <div className="space-y-6 p-6">
      {/* Header with back link */}
      <GuestPageHeader 
        guest={guest} 
        status={status} 
        room={room}
        companions={companions}
      />
      
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <GuestProfileCard guest={guest} companions={companions} />
          <GuestActivityCard ... />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <GuestPreferencesCard guestId={guest.id} />
          <GuestIntelligenceCard guest={guest} />
        </div>
      </div>
    </div>
  );
};
```

### Header Component Design

```typescript
// GuestPageHeader.tsx
const GuestPageHeader: React.FC<Props> = ({ guest, status, room, companions }) => {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* Back Link */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/admin/guests')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to guests
      </Button>
      
      {/* Name + Status Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{guest.first_name} {guest.last_name}</h1>
          <p className="text-muted-foreground">360° Guest View</p>
        </div>
        <Badge>{status || 'NO STAY'}</Badge>
      </div>
      
      {/* Context Bar */}
      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
        <span>📅 {formatDates(guest)}</span>
        <span>🏠 Room #{guest.room_number} ({room?.type || 'Standard Guest'})</span>
        <span>👥 {getOccupancy(companions)}</span>
      </div>
    </div>
  );
};
```

---

## Card Layout Updates

### GuestPreferencesCard

Add category-based sections:
- **ROOM**: High floor, King bed, etc.
- **DINING**: No spicy food, etc.
- **SERVICE**: Extra towels, etc.

### GuestActivityCard

Convert from tabs to vertical sections:
- **SERVICE REQUESTS**: List or "No requests recorded"
- **DINING RESERVATIONS**: List or "No reservations recorded"
- **PREVIOUS ISSUES**: List of complaints or "No complaints"

### GuestIntelligenceCard

Add header action buttons:
- **Alert** button: Opens dialog to add medical alert
- **Note** button: Opens dialog to add staff note

---

## Summary

This implementation will:

1. Create a dedicated full-page view for Guest 360° at `/admin/guests/:guestId`
2. Navigate to this page when clicking the eye icon (instead of opening a sidebar)
3. Display content in a user-friendly 2-column grid layout matching the reference design
4. Include a "Back to guests" link for easy navigation
5. Show guest status prominently in the header
6. Organize cards with Profile & Activity on the left, Preferences & Intelligence on the right
7. Remove the now-unnecessary Sheet-based implementation

