
# Make Alert, Note, and Add Buttons Functional on Admin Guest Detail Page

## Overview
The admin Guest 360 page has three non-functional buttons: the "Add" button on the Preferences card, the "Alert" button, and the "Note" button on the Intelligence card. This plan wires them up to work properly, reusing the existing dialog components from the guest profile, and also creates a new staff notes system.

## What Changes

### 1. GuestPreferencesCard - Wire up "Add" button
- Import `AddPreferenceDialog` from the profile components
- Add state for dialog open/close
- Add a mutation to insert preferences into `guest_preferences` table using the guest's ID (passed as prop)
- Invalidate the `admin-guest-preferences` query on success
- The "Add" button opens the dialog, and on submit it inserts directly with the known `guestId`

### 2. GuestIntelligenceCard - Wire up "Alert" button
- Import `AddMedicalAlertDialog` from the profile components
- Add state for dialog open/close
- Add a mutation to insert into `guest_medical_alerts` table using `guest.id`
- Invalidate the `admin-guest-alerts` query on success
- The "Alert" button opens the dialog, and on submit it inserts the alert

### 3. GuestIntelligenceCard - Wire up "Note" button and "Add a note"
- Create a new database table `guest_staff_notes` with columns: `id`, `guest_id` (uuid), `author_name` (text), `content` (text), `created_at` (timestamptz)
- Create a simple `AddStaffNoteDialog` component with a textarea for the note content
- Add a query to fetch notes from `guest_staff_notes` for the guest
- Add a mutation to insert notes
- Display existing notes in the Staff-to-Staff Notes section
- Both the "Note" button in the header and the "Add a note" button at the bottom open the dialog

## Technical Details

### New Database Table
Table: `guest_staff_notes`
- `id` uuid PK default gen_random_uuid()
- `guest_id` uuid NOT NULL
- `author_name` text NOT NULL
- `content` text NOT NULL
- `created_at` timestamptz default now()

RLS policies:
- Admins can manage all notes (ALL using is_admin(auth.uid()))
- Admins can view all notes (SELECT using is_admin(auth.uid()))

### New Component
`src/pages/admin/components/guests/AddStaffNoteDialog.tsx`
- Simple dialog with a textarea for the note content
- Props: `open`, `onOpenChange`, `onAdd` (callback with `{ content: string }`)

### Modified Files
1. **`src/pages/admin/components/guests/GuestPreferencesCard.tsx`**
   - Add `useState` for dialog open state
   - Add `useMutation` for inserting preferences
   - Import and render `AddPreferenceDialog`
   - Wire the "Add" button's `onClick` to open the dialog

2. **`src/pages/admin/components/guests/GuestIntelligenceCard.tsx`**
   - Add `useState` for alert dialog and note dialog open states
   - Add `useMutation` for inserting alerts and notes
   - Add `useQuery` for fetching staff notes
   - Import and render `AddMedicalAlertDialog` and `AddStaffNoteDialog`
   - Wire "Alert" button and "Note" button to open respective dialogs
   - Render fetched notes in the staff notes section with author name and timestamp

3. **New file: `src/pages/admin/components/guests/AddStaffNoteDialog.tsx`**

4. **Database migration** to create `guest_staff_notes` table with RLS policies
