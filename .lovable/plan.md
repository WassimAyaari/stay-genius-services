

# Hotel Genius Landing Page

## Overview
Replace the current home page (`/`) with a beautiful, modern SaaS-style landing page for the Hotel Genius platform. The existing hotel guest home page will move to `/hotel/hotel-genius` for the demo.

## Landing Page Sections

### 1. Header
- Hotel Genius logo (using existing `/lovable-uploads/aab13959-5215-4313-87f8-c3012cdb27f0.png`)
- Clean minimal header with "Login" link on the right
- No BottomNav or MainMenu -- this is a standalone page

### 2. Hero Section
- Large headline: "The Smart Hotel Directory Platform"
- Subtext describing what Hotel Genius offers to hotels
- Prominent **"Create Free Account"** button (primary teal color)
- Secondary "Explore Demo" button
- Background with subtle gradient using the brand teal (`#00AFB9`)

### 3. How It Works Section
- 3 steps displayed as animated cards with icons:
  1. **Create Your Account** -- Sign up for free in under 2 minutes
  2. **Set Up Your Hotel** -- Add restaurants, spa, events, and hotel info
  3. **Share With Guests** -- Your hotel gets a dedicated page guests can browse
- Each step card with an icon, number badge, title, and description

### 4. Hotel Directory Section
- Section title: "Discover Our Hotels"
- Responsive grid of hotel cards
- **For now**: one demo card "Hotel Genius" with a hotel image
- Clicking it navigates to `/hotel/hotel-genius` (the current guest home page)
- Cards feature: image, hotel name, hover shadow animation via Framer Motion

### 5. Footer
- Simple footer with Hotel Genius branding

## Visual Design
- Clean white background with teal accent sections
- Framer Motion animations for scroll reveal on each section
- Gradient backgrounds on hero section
- Card hover effects with shadow transitions
- Fully responsive (mobile-first)
- Uses existing Shadcn UI components (Button, Card) and Tailwind styling

## Routing Changes

**Current:**
- `/` renders `Index` (hotel guest home page)

**New:**
- `/` renders `LandingPage` (platform landing page)
- `/hotel/hotel-genius/*` renders the existing guest home page (`PublicRoutes`)
- All other existing routes remain unchanged for now

### App.tsx Update
```text
Routes:
  /                        --> LandingPage (NEW)
  /hotel/:hotelSlug/*      --> PublicRoutes (moved here)
  /profile/*               --> AuthenticatedRoutes (unchanged)
  /admin/*                 --> AdminRoutes (unchanged)
  ...other authenticated routes unchanged
```

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/LandingPage.tsx` | Main landing page assembling all sections |
| `src/components/landing/LandingHeader.tsx` | Minimal header with logo and login |
| `src/components/landing/LandingHero.tsx` | Hero section with CTAs |
| `src/components/landing/HowItWorks.tsx` | 3-step explanation section |
| `src/components/landing/HotelDirectory.tsx` | Hotel cards grid section |
| `src/components/landing/HotelCard.tsx` | Individual hotel card component |
| `src/components/landing/LandingFooter.tsx` | Simple footer |

## Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Add `/` route for LandingPage, add `/hotel/:hotelSlug/*` for PublicRoutes |
| `src/routes/PublicRoutes.tsx` | No changes needed -- it will just render under the new prefix |

## Technical Details

### Demo Hotel Card (hardcoded for now)
```text
{
  slug: 'hotel-genius',
  name: 'Hotel Genius',
  image: Unsplash luxury hotel image,
  description: 'Experience our demo hotel'
}
```

### "Create Free Account" Button
For this initial step, clicking it will show a toast notification saying "Coming soon -- hotel registration will be available shortly." The full registration flow will be built in a future step.

### Animations
- Hero section: fade-in on mount
- How It Works cards: staggered fade-in using Framer Motion
- Hotel cards: hover scale + shadow transitions

### No Database Changes
Everything is hardcoded for this step. When the multi-tenant system is built later, hotel cards will be fetched from the `hotels` table.

