
# Fix Duplicate Toasts Across All Actions

## Problem

When a guest or admin performs an action (create, update, cancel), multiple toast notifications appear because the same event is caught by several overlapping systems:

1. **Form/mutation success handlers** -- toast on direct action success
2. **`useReservationsRealtime.tsx`** -- real-time listener that also toasts on INSERT and UPDATE events
3. **`useNotificationsRealtime.ts`** -- notification system real-time listener that also toasts
4. **`useTableReservationListeners.ts` / `useSpaBookingListeners.ts` / `useServiceRequestListeners.ts`** -- notifications page listeners that also toast

### Specific Duplicates Found

**Creating a restaurant booking (3 toasts):**
- `RestaurantBookingForm.tsx`: "Restaurant booking request sent successfully!" (KEEP -- this is the direct user action feedback)
- `useReservationsRealtime.tsx`: "New reservation" (REMOVE -- duplicate from real-time INSERT)
- `useNotificationsRealtime.ts`: triggers via realtime too (no toast on INSERT, but refetches)

**Creating a spa booking (2 toasts):**
- `SpaBookingForm.tsx`: "Spa booking request sent successfully" (KEEP)
- `useSpaBookingMutations.tsx`: "Reservation creee avec succes" (REMOVE -- the form already shows success)

**Admin confirms/updates a reservation (3+ toasts):**
- `useAllTableReservations.ts` or `useSpaBookingMutations.tsx`: "Statut de la reservation mis a jour" (KEEP -- admin action feedback)
- `useReservationsRealtime.tsx`: "Mise a jour de reservation" (REMOVE -- duplicate real-time toast on guest side when admin is also the one triggering)
- `useNotificationsRealtime.ts`: "Reservation Update" (REMOVE toast, keep refetch)
- `useTableReservationListeners.ts`: "Mise a jour de reservation" (REMOVE toast, keep refetch)
- `useSpaBookingListeners.ts`: "Mise a jour de demande de reservation spa" (REMOVE toast, keep refetch)
- `useServiceRequestListeners.ts`: "Mise a jour de demande" (REMOVE toast, keep refetch)

**Admin confirms spa booking (2+ toasts):**
- `SpaBookingsTab.tsx`: "Status updated successfully" (KEEP)
- `useSpaBookingMutations.tsx`: "Statut de la reservation mis a jour" (REMOVE -- duplicate from mutation)

## Solution

**Principle**: Only the direct action handler (the form submit or the button click) should show a toast. Real-time listeners should silently refetch data without showing toasts -- their job is to update the UI, not to notify the person who performed the action.

## Changes

### 1. `src/hooks/reservations/useReservationsRealtime.tsx`
- Remove all `toast.info()` calls (lines 38-41 and 89-92 and 105-108)
- Keep the `queryClient.invalidateQueries()` calls so the UI still updates

### 2. `src/hooks/notifications/useNotificationsRealtime.ts`
- Remove all `toast.info()` calls from `handleReservationStatusChange`, `handleServiceStatusChange`, `handleSpaBookingStatusChange`, `handleEventReservationStatusChange`
- Keep `setHasNewNotifications(true)` and `refetch*()` calls -- the notification badge still updates

### 3. `src/pages/notifications/hooks/listeners/useTableReservationListeners.ts`
- Remove `toast.info()` in `handleReservationUpdate` (line 54)
- Keep `refetchReservations()` call

### 4. `src/pages/notifications/hooks/listeners/useSpaBookingListeners.ts`
- Remove `notifySpaBookingStatusChange()` calls and the function itself
- Keep `refetchSpaBookings()` calls

### 5. `src/pages/notifications/hooks/listeners/useServiceRequestListeners.ts`
- Remove `toast.info()` in `handleServiceRequestUpdate` (line 57)
- Keep `refetchRequests()` call

### 6. `src/hooks/spa/useSpaBookingMutations.tsx`
- Remove `toast.success('Reservation creee avec succes')` from `createBookingMutation.onSuccess` (line 28) -- the `SpaBookingForm.tsx` already shows this
- Remove `toast.success('Statut de la reservation mis a jour')` from `updateBookingStatusMutation.onSuccess` (line 53) -- the admin page (`SpaBookingsTab.tsx`) already shows this

### 7. `src/hooks/reservations/useTableReservationsCore.tsx`
- Check for duplicate toasts in cancel/update mutations that may overlap with admin page toasts

### 8. `src/hooks/events/useEventReservationMutations.tsx`
- Remove `toast.success('Reservation creee avec succes')` from `createMutation.onSuccess` (line 41) -- the event booking form already shows success
- Keep the cancel and update status toasts as they are direct action feedback

## Summary

| File | Action |
|------|--------|
| `useReservationsRealtime.tsx` | Remove all toast calls, keep data refetch |
| `useNotificationsRealtime.ts` | Remove all toast calls from status change handlers, keep badge updates |
| `useTableReservationListeners.ts` | Remove toast, keep refetch |
| `useSpaBookingListeners.ts` | Remove toast function and calls, keep refetch |
| `useServiceRequestListeners.ts` | Remove toast, keep refetch |
| `useSpaBookingMutations.tsx` | Remove create and update status success toasts (handled by calling components) |
| `useEventReservationMutations.tsx` | Remove create success toast (handled by calling form) |

After these changes, each action will produce exactly **one** toast -- from the component that initiated the action.
