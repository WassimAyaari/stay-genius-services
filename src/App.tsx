
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthGuard from "@/components/AuthGuard";
import Layout from './components/Layout';
import Index from "./pages/Index";
import RoomDetails from "./pages/rooms/RoomDetails";
import MyRoom from "./pages/my-room/MyRoom";
import Dining from "./pages/dining/Dining";
import RestaurantDetail from "./pages/dining/RestaurantDetail";
import Spa from "./pages/spa/Spa";
import Activities from "./pages/activities/Activities";
import Services from "./pages/services/Services";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import Messages from './pages/messages/Messages';
import About from './pages/about/About';
import Destination from './pages/destination/Destination';
import Shops from './pages/shops/Shops';
import HotelMap from './pages/map/HotelMap';
import Feedback from './pages/feedback/Feedback';
import Events from './pages/events/Events';

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth/login" element={<Login />} />
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/" element={<Index />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-room" element={<MyRoom />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/dining/:id" element={<RestaurantDetail />} />
          <Route path="/spa" element={<Spa />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/about" element={<About />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/map" element={<HotelMap />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/events" element={<Events />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AuthGuard>
            <AnimatedRoutes />
          </AuthGuard>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
