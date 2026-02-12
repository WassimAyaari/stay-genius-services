

# Fix: Add Accompanist Dialog -- Stop Layout Shift and Restore Backdrop

## Problem
The "Add Accompanist" dialog in `CompanionsList.tsx` still uses the default `modal` mode, causing the same layout shift issue that was already fixed for the Preference and Medical Alert dialogs.

## Solution
Apply the exact same pattern used for the other two dialogs:
1. Add `modal={false}` to prevent scrollbar manipulation
2. Add a manual backdrop div for the dark overlay

## File to Edit

### `src/pages/profile/components/CompanionsList.tsx`

Change the Dialog section (around line 179) from:

```tsx
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="sm:max-w-[425px]">
```

To:

```tsx
{isDialogOpen && <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setIsDialogOpen(false)} />}
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={false}>
  <DialogContent className="sm:max-w-[425px]">
```

This is the same two-line change already applied to `AddPreferenceDialog.tsx` and `AddMedicalAlertDialog.tsx`.
