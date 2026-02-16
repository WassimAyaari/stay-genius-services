
# Redesign Landing Page for Guest-Focused Experience

## Overview
Transform the landing page from a hotel-owner-facing marketing page into a guest-facing hotel directory. Guests arrive here, see the list of hotels, pick one, and enter that hotel's dedicated experience.

## Changes

### 1. LandingHeader.tsx -- Simplify
- Remove the "Login" button entirely (guests must choose a hotel first)
- Remove the duplicate "Hotel Genius" text next to the logo (the logo image already contains the brand name)
- Keep only the logo, centered or left-aligned cleanly

### 2. LandingHero.tsx -- Rewrite for Guests
- Change headline to something guest-focused, e.g. **"Your Hotel, At Your Fingertips"**
- Update description to focus on the guest experience: browsing hotel services, chatting with concierge, discovering restaurants and spa
- Remove the "Create Free Account" button (not relevant for guests)
- Remove the "Explore Demo" button
- Make the hero section shorter and more compact so hotel cards are visible quickly
- Keep subtle gradient background and animation

### 3. LandingPage.tsx -- Remove HowItWorks
- Remove the `HowItWorks` import and component from the page
- Page flow becomes: Header -> compact Hero -> Hotel Directory -> Footer

### 4. HotelDirectory.tsx -- Add Fiesta Beach Djerba
- Add a second hardcoded hotel card:
  - Name: "Fiesta Beach Djerba"
  - Image: a beach/resort Unsplash image
  - Slug: `fiesta-beach-djerba`
- Keep "Hotel Genius" as the first card
- Both cards link to `/hotel/{slug}` on click

### 5. LandingFooter.tsx -- Fix duplicate branding
- Remove the "Hotel Genius" text next to the logo (same issue as header)

## Files to Modify

| File | Change |
|------|--------|
| `src/components/landing/LandingHeader.tsx` | Remove Login button, remove duplicate "Hotel Genius" text |
| `src/components/landing/LandingHero.tsx` | Rewrite headline/description for guests, remove CTA buttons, make section compact |
| `src/pages/LandingPage.tsx` | Remove HowItWorks import and usage |
| `src/components/landing/HotelDirectory.tsx` | Add "Fiesta Beach Djerba" card to the list |
| `src/components/landing/LandingFooter.tsx` | Remove duplicate brand text |

## No files to create or delete
## No database changes
