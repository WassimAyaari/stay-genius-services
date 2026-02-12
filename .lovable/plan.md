

# Guest Preferences & Medical Alerts Feature

## Overview
Create a full preferences system that allows guests to manage their own preferences and medical information from their profile page, with all data displayed in the admin's Guest 360 view.

## Database Changes

### New Table: `guest_preferences`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto-generated |
| guest_id | uuid | FK to guests.id |
| category | text | "room", "dining", or "service" |
| value | text | e.g. "Vegetarian", "Non-smoking", "Sea view" |
| created_at | timestamptz | default now() |

**RLS policies**: Guests can manage their own preferences (via guests.user_id = auth.uid()), admins can view all.

### New Table: `guest_medical_alerts`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto-generated |
| guest_id | uuid | FK to guests.id |
| alert_type | text | "Medical alert" or "Allergy" |
| severity | text | "Low", "Medium", "High", "Critical" |
| description | text | Free-text detail |
| created_at | timestamptz | default now() |

**RLS policies**: Same pattern -- guests manage their own, admins view all.

## Guest Profile Page (User-Facing)

### New Component: `PreferencesSection.tsx`
A new card added to the Profile page between "Current Stay" and "Companions", containing:

**Medical Alerts / Allergies sub-section**:
- Displays existing alerts as color-coded cards (red/pink background for Critical/High)
- Each alert shows: type badge, severity badge, description, edit/delete icons

**Preferences sub-section**:
- Grouped by category (Dining, Room, Service) with icons
- Each preference shown as a colored chip/pill
- Delete option on each chip

**Two action buttons in the header**:
- "+ Preference" -- opens Add Preference Dialog
- "Medical Alert" -- opens Add Medical Alert Dialog

### New Component: `AddPreferenceDialog.tsx`
Dialog with:
- **Preference type**: Select dropdown (Room preference, Dining preference, Service preference)
- **Preference**: Text input with placeholder "E.g.: Sea view, Vegetarian..."
- **Quick suggestions**: Clickable chips that auto-fill the text input, varying by selected category:
  - Room: "High floor", "Sea view", "Quiet room", "Non-smoking", "King size bed"
  - Dining: "Vegetarian", "Vegan", "Halal", "Gluten-free", "No seafood"
  - Service: "Early check-in", "Late check-out", "Extra towels", "Hypoallergenic pillows"
- Cancel / Add buttons

### New Component: `AddMedicalAlertDialog.tsx`
Dialog with:
- **Alert type**: Select (Medical alert, Allergy)
- **Severity level**: Select (Low, Medium, High, Critical)
- **Description**: Textarea with placeholder "Describe your condition or allergy..."
- Cancel / Add buttons

### Hook: `useGuestPreferences.ts`
Custom hook that:
- Fetches preferences and medical alerts for the current user's guest record
- Provides add/delete mutations for both preferences and alerts
- Uses react-query for caching and invalidation

## Admin Guest 360 (Read-Only Display)

### Update: `GuestPreferencesCard.tsx`
- Fetch real data from `guest_preferences` table using the guest's `id`
- Display preferences grouped by category as colored chips (current UI structure is kept)
- The "Add" button in the admin view will be kept for future admin-side additions

### Update: `GuestIntelligenceCard.tsx`
- Fetch medical alerts from `guest_medical_alerts` table
- Display in the "Active Alerts" section with severity badges and color coding
- Replace the current "No active alerts" placeholder with real data

## Files to Create
- `src/pages/profile/components/PreferencesSection.tsx` -- main preferences card for guest profile
- `src/pages/profile/components/AddPreferenceDialog.tsx` -- add preference dialog
- `src/pages/profile/components/AddMedicalAlertDialog.tsx` -- add medical alert dialog
- `src/pages/profile/hooks/useGuestPreferences.ts` -- data fetching hook

## Files to Edit
- `src/pages/profile/Profile.tsx` -- add PreferencesSection to the page layout
- `src/pages/admin/components/guests/GuestPreferencesCard.tsx` -- fetch real preferences data
- `src/pages/admin/components/guests/GuestIntelligenceCard.tsx` -- fetch real medical alerts data

## Technical Notes
- Guest preferences are linked via `guest_id` (the UUID from `guests.id`), not `user_id`, to keep the relationship clean
- The guest profile hook will first resolve the current user's `guest_id` from the `guests` table using `auth.uid()`
- RLS policies use a subquery: `guest_id IN (SELECT id FROM guests WHERE user_id = auth.uid())` for guest access
- Admin access uses the existing `is_admin()` function
