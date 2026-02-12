

# Fix: Cards Shifting When Clicking Buttons on Profile

## Problem
When you click any button that opens a dialog (like "Preference" or "Medical Alert"), all cards shift slightly to the right. This happens because Radix Dialog's default modal mode hides the body scrollbar momentarily, causing a layout shift.

## Root Cause
The dialogs in the profile page (`AddPreferenceDialog.tsx` and `AddMedicalAlertDialog.tsx`) do not have `modal={false}` set on the `<Dialog>` component. The admin panel already uses this pattern to prevent the same issue.

## Fix
Add `modal={false}` to the `<Dialog>` component in both dialog files. This prevents Radix from manipulating the body scrollbar while still keeping the dialogs functional.

## Files to Edit

### `src/pages/profile/components/AddPreferenceDialog.tsx`
- Change `<Dialog open={open} onOpenChange={onOpenChange}>` to `<Dialog open={open} onOpenChange={onOpenChange} modal={false}>`

### `src/pages/profile/components/AddMedicalAlertDialog.tsx`
- Change `<Dialog open={open} onOpenChange={onOpenChange}>` to `<Dialog open={open} onOpenChange={onOpenChange} modal={false}>`

This is a two-line change that aligns the profile dialogs with the pattern already used across the admin panel.

