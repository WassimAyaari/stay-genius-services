

# Fix: Restore Dark Backdrop on Profile Dialogs

## Problem
Setting `modal={false}` on the Dialog components fixed the layout shift, but it also removed the semi-transparent black overlay/backdrop behind the dialog. The user wants both: no layout shift AND the dark backdrop visible (as shown in their screenshot).

## Root Cause
When `modal={false}` is set, Radix Dialog skips rendering the `DialogOverlay` component inside `DialogPortal`. The overlay is part of the `DialogContent` component in `src/components/ui/dialog.tsx`, but it only renders in modal mode.

## Solution
Add a manual overlay `<div>` inside the `DialogContent` of the two profile dialogs, styled identically to the standard `DialogOverlay` (`fixed inset-0 z-50 bg-black/80`). This preserves `modal={false}` (no scrollbar manipulation) while restoring the dark backdrop.

## Files to Edit

### `src/pages/profile/components/AddPreferenceDialog.tsx`
- Add a backdrop div before `DialogContent`:
```tsx
<Dialog open={open} onOpenChange={onOpenChange} modal={false}>
  <DialogPortal>
    {open && <div className="fixed inset-0 z-50 bg-black/80" />}
    <DialogContent className="sm:max-w-md">
      ...
    </DialogContent>
  </DialogPortal>
</Dialog>
```
- Remove `DialogContent`'s built-in portal wrapping by switching to use `DialogPortal` explicitly so we can insert the backdrop alongside the content.

### `src/pages/profile/components/AddMedicalAlertDialog.tsx`
- Same change: add manual backdrop div inside an explicit `DialogPortal`.

### Alternative (simpler approach)
Instead of restructuring the portal, we can add a click-to-close overlay div rendered conditionally alongside the Dialog:
```tsx
{open && <div className="fixed inset-0 z-50 bg-black/80" onClick={() => onOpenChange(false)} />}
```
This div is rendered as a sibling just before `DialogContent`, providing the visual backdrop and click-to-dismiss behavior without changing the dialog component itself.

## Result
- Dark semi-transparent backdrop appears when dialogs open (matching the screenshot)
- No layout shift when opening/closing dialogs
- Click on backdrop still closes the dialog

