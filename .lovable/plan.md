

# Plan: Restrict Bookings to Logged-in Users & Ensure English Display

## Problem Summary

1. **Booking Access**: Currently, any user (logged in or not) can click on "Book" buttons for restaurants, spa, events, and activities. The system should redirect non-logged-in users to the login page instead.

2. **French Text**: Several components have hardcoded French text that should be in English.

---

## Solution Overview

Create a reusable **authentication check** that intercepts booking actions. When a non-authenticated user clicks a "Book" button, they'll see a toast message and be redirected to the login page.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/hooks/useRequireAuth.ts` | **NEW** - Create a reusable hook for auth-gated actions |
| `src/pages/spa/Spa.tsx` | Add auth check before opening spa booking dialog |
| `src/pages/dining/Dining.tsx` | Add auth check before opening restaurant booking dialog |
| `src/pages/dining/RestaurantDetail.tsx` | Add auth check + translate French text to English |
| `src/pages/events/Events.tsx` | Add auth check before opening event booking dialog |
| `src/pages/activities/Activities.tsx` | Add auth check (already partially implemented but needs redirect) |
| `src/components/events/EventBookingCard.tsx` | Add auth check + translate French text |
| `src/features/spa/components/SpaServiceCard.tsx` | Add auth check wrapper |
| `src/features/spa/components/SpaSection.tsx` | Pass auth check to card |
| `src/features/activities/components/ActivityCard.tsx` | Add auth check wrapper |
| `src/pages/dining/components/RestaurantInfo.tsx` | Translate French text |
| `src/pages/dining/components/BookingDialog.tsx` | Translate French text |
| `src/components/events/EventBookingDialog.tsx` | Translate French text |
| `src/pages/notifications/components/details/spa/SpaBookingFacilityInfo.tsx` | Translate French text |

---

## Implementation Details

### Step 1: Create useRequireAuth Hook

```typescript
// src/hooks/useRequireAuth.ts
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';

export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please log in to make a booking.",
      });
      navigate('/auth/login', { state: { from: window.location.pathname } });
      return;
    }
    callback();
  };

  return { requireAuth, isAuthenticated };
};
```

### Step 2: Update Booking Handlers in Each Page

**Spa Page:**
```typescript
const handleBookTreatment = (serviceId: string) => {
  requireAuth(() => {
    setSelectedService(serviceId);
    setIsBookingOpen(true);
  });
};
```

**Dining Page:**
```typescript
const handleBookTable = (restaurantId: string) => {
  requireAuth(() => {
    const restaurant = restaurants?.find(r => r.id === restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setIsBookingOpen(true);
    }
  });
};
```

**Events Page:**
```typescript
const handleBookEvent = (event: Event) => {
  requireAuth(() => {
    setSelectedEvent(event);
    setIsBookingOpen(true);
  });
};
```

**Activities Page:**
```typescript
const handleBookActivity = (activityId: string) => {
  requireAuth(async () => {
    // existing booking logic
  });
};
```

### Step 3: Translate French Text to English

| Location | French Text | English Translation |
|----------|-------------|---------------------|
| `EventBookingCard.tsx` | "places disponibles" | "spots available" |
| `EventBookingCard.tsx` | "Réserver l'événement" | "Book Event" |
| `RestaurantDetail.tsx` | "Événements à venir" | "Upcoming Events" |
| `RestaurantInfo.tsx` | "Réserver une table" | "Book a Table" |
| `BookingDialog.tsx` | "Modifier votre réservation" | "Edit your reservation" |
| `BookingDialog.tsx` | "Réserver une table" | "Book a Table" |
| `BookingDialog.tsx` | "Remplissez le formulaire..." | "Fill out the form below to book a table." |
| `EventBookingDialog.tsx` | "Modifier votre réservation" | "Edit your reservation" |
| `EventBookingDialog.tsx` | "Réserver" | "Book" |
| `EventBookingDialog.tsx` | "Remplissez le formulaire..." | "Fill out the form below to reserve your spot." |
| `SpaBookingFacilityInfo.tsx` | "Détails de l'installation" | "Facility Details" |
| `SpaBookingFacilityInfo.tsx` | "Informations sur l'installation non disponibles" | "Facility information not available" |

---

## User Flow After Changes

```text
User clicks "Book" button
       │
       ▼
 Is user logged in?
       │
  ┌────┴────┐
  │         │
 YES        NO
  │         │
  ▼         ▼
Open      Show toast:
booking   "Login Required"
dialog        │
              ▼
         Redirect to
         /auth/login
              │
              ▼
         After login,
         return to
         original page
```

---

## Expected Result

After these changes:
1. Non-authenticated users clicking any "Book" button will see a toast message and be redirected to login
2. After logging in, they can return to the page and book successfully
3. All text in the guest-facing UI will be in English
4. Authenticated users will see no change in their booking experience

