

# Build the HotelGenius Animated Demo Page

Create a full-screen, auto-advancing animated presentation at `/demo` with 5 scenes using framer-motion. Dark cinematic background, phone/tablet mockups, kinetic typography, and glassmorphic pricing cards.

## New Files

### `src/pages/demo/DemoVideo.tsx`
Main orchestrator page:
- Full-screen dark background (`bg-[#0a0a0a]`)
- State machine: `currentScene` (0-4), auto-advances via `useEffect` timer
- Top progress bar (thin green line advancing over 60s)
- Bottom controls: play/pause, scene dots, replay
- `AnimatePresence` wrapping current scene component
- Scene timings: Intro 10s, Guest 15s, Team 15s, Plans 10s, Outro 10s
- No app Layout/header/footer — standalone fullscreen page

### `src/pages/demo/scenes/IntroScene.tsx`
- Logo (`/lovable-uploads/aab13959-...`) drops in with spring animation
- Badge text "#1 Smart Hospitality Ecosystem" fades in
- Tagline: "The Agentic AI ecosystem that unifies your hotel operations and guest experience"
- PhoneMockup slides up from bottom showing a screenshot of the guest app homepage

### `src/pages/demo/scenes/GuestScene.tsx`
- Phone mockup centered with welcome widget: "Welcome back, Mr. Muller"
- Chat action buttons pop in sequentially (staggered 0.3s): Ask, Book, Go, Tip — each with an icon and green accent
- Simulated chat bubble exchange: guest asks "Late checkout?" → AI responds instantly
- Text overlay: "Zero friction. No app downloads. 100+ languages."

### `src/pages/demo/scenes/TeamScene.tsx`
- Phone shrinks left, tablet mockup slides in from right showing admin dashboard
- "360° Unified Dashboard" kinetic text
- "Agentic AI in Action" badge pulses
- Animated service ticket: guest request → auto-routed to Housekeeping
- Animated counters: "Bookings ++" and "Sales ++" with numbers ticking up

### `src/pages/demo/scenes/PlansScene.tsx`
- Three glassmorphic cards slide up with stagger (`backdrop-blur-xl bg-white/5 border border-white/10`)
- Discovery (Free): Mobile Web App & Tipping
- Essential: Unlimited AI & PMS Sync
- Elite: Agentic AI & Full Omnichannel
- Green checkmarks cascade down each card's feature list

### `src/pages/demo/scenes/OutroScene.tsx`
- Screen clears to black
- "Elevate Experience. Streamline Operations." drops in bold white
- Glowing green "Book a Demo" button with animated cursor click
- Logo and "www.hotelgenius.app" fade in
- Subtle shimmer/chime effect on logo

### `src/pages/demo/components/PhoneMockup.tsx`
- CSS-only phone frame: rounded-[2.5rem], dark bezel border, notch at top
- Accepts `children` for screen content
- Optional `scale` prop for shrinking in transitions

### `src/pages/demo/components/TabletMockup.tsx`
- Similar to phone but wider aspect ratio, thinner bezels

### `src/pages/demo/components/DemoProgressBar.tsx`
- Thin bar at very top of screen
- Width transitions from 0% to 100% over total duration
- Green (`bg-primary`) on dark background

## Modified Files

### `src/routes/PublicRoutes.tsx`
- Add: `import DemoVideo from '@/pages/demo/DemoVideo'`
- Add route: `<Route path="demo" element={<DemoVideo />} />`

## Implementation Order
1. Create PhoneMockup, TabletMockup, DemoProgressBar components
2. Create all 5 scene components in parallel
3. Create DemoVideo.tsx orchestrator with timer and AnimatePresence
4. Add route to PublicRoutes

