
# Plan: Fix Spa Bookings Display and Translate Admin Dashboard to English

## Problem Summary

There are **two issues** preventing spa reservations from appearing in the admin dashboard:

### Issue 1: RLS Policy Uses Wrong Admin Check
The `spa_bookings` table has an RLS policy that uses the `is_admin(auth.uid())` function. However, this function checks for `raw_app_meta_data->>'is_admin' = 'true'` in `auth.users`, but **no users have this field set**.

The actual admin roles are stored in the `user_roles` table with `role = 'admin'`. The admin account `ammna.jmal@gmail.com` has an entry in `user_roles` but not in `raw_app_meta_data`.

**Current `is_admin` function:**
```sql
SELECT EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = user_id
  AND raw_app_meta_data->>'is_admin' = 'true'  -- Never true for any user
);
```

**Result:** The admin cannot see all bookings because the RLS policy check fails.

### Issue 2: Admin Dashboard Text in French
The `SpaBookingsTab.tsx` and `SpaManager.tsx` components have hardcoded French text that is not using the i18n translation system. Examples:
- "Gestion du Spa" should be "Spa Management"
- "Réservations Spa" should be "Spa Bookings"
- "En attente" should be "Pending"
- "Actualiser" should be "Refresh"

---

## Solution

### Part 1: Fix the `is_admin` Database Function

Update the `is_admin(user_id)` function to check the `user_roles` table instead of `raw_app_meta_data`:

```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = $1
    AND role = 'admin'
  );
$$;
```

This aligns the function with the `is_user_admin` and `has_role` functions that already use the `user_roles` table.

### Part 2: Translate Admin Spa Dashboard to English

Update these files to replace hardcoded French text with English:

**File: `src/pages/admin/SpaManager.tsx`**
| French | English |
|--------|---------|
| Gestion du Spa | Spa Management |
| Gérez les installations, services et réservations du spa | Manage spa facilities, services and bookings |
| Réservations | Bookings |
| Installations | Facilities |
| Services | Services |
| Gérez les réservations de spa et leurs statuts | Manage spa bookings and their status |
| Gérez les différentes installations de spa | Manage the different spa facilities |
| Gérez les services offerts dans chaque installation | Manage services offered in each facility |

**File: `src/pages/admin/spa/SpaBookingsTab.tsx`**
| French | English |
|--------|---------|
| Réservations Spa | Spa Bookings |
| Actualiser | Refresh |
| Recherche | Search |
| Nom, email, chambre... | Name, email, room... |
| Statut | Status |
| Tous les statuts | All statuses |
| En attente | Pending |
| Confirmées | Confirmed |
| Terminées | Completed |
| Annulées | Cancelled |
| Date | Date |
| Réservation # | Booking # |
| Service inconnu | Unknown service |
| Chambre | Room |
| Demandes spéciales | Special requests |
| Annuler | Cancel |
| Chargement des réservations... | Loading bookings... |
| Aucune réservation trouvée | No bookings found |
| Statut mis à jour avec succès | Status updated successfully |
| Erreur lors de la mise à jour du statut | Error updating status |
| Réservation annulée avec succès | Booking cancelled successfully |
| Sélectionner le statut | Select status |

---

## Files to Modify

| File | Change |
|------|--------|
| SQL Migration | Create new migration to update `is_admin` function |
| `src/pages/admin/SpaManager.tsx` | Replace French text with English |
| `src/pages/admin/spa/SpaBookingsTab.tsx` | Replace French text with English |

---

## Technical Details

### Why the RLS Policy Fails

The current data flow:
```text
Admin logs in (ammna.jmal@gmail.com)
    ↓
Admin opens Spa Manager → SpaBookingsTab
    ↓
useBookingsFetch() calls supabase.from('spa_bookings').select(*)
    ↓
RLS Policy "Admins can manage all bookings" evaluates is_admin(auth.uid())
    ↓
is_admin() checks: raw_app_meta_data->>'is_admin' = 'true'
    ↓
Returns FALSE (field not set for any user)
    ↓
Policy falls back to "Users can view their own bookings" 
    ↓
Only shows bookings where user_id = auth.uid()
    ↓
Returns EMPTY (booking was made by different user)
```

After the fix:
```text
is_admin() checks: EXISTS in user_roles WHERE role = 'admin'
    ↓
Returns TRUE (user has admin role)
    ↓
All bookings are returned ✓
```

### Translation Approach

Since the admin dashboard has hardcoded French text rather than using the i18n system, and you want English, I will directly replace the French strings with English equivalents. This is simpler than adding i18n keys for admin-only pages.

---

## Expected Result

After implementing these changes:
1. The admin dashboard will show ALL spa bookings, not just the admin's own bookings
2. The admin can confirm, complete, or cancel any booking
3. All text on the Spa Manager page will be in English
4. The new booking you created will be visible in the admin panel
