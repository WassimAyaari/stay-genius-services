
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider } from "@/features/auth/hooks/useAuthContext";
import AuthGuard from "@/components/AuthGuard";
import Layout from './components/Layout';
import Index from "./pages/Index";
import RoomDetails from "./pages/rooms/RoomDetails";
import MyRoom from "./pages/my-room/MyRoom";
import ServiceRequestDetails from "./pages/my-room/ServiceRequestDetails";
import Dining from "./pages/dining/Dining";
import RestaurantDetail from "./pages/dining/RestaurantDetail";
import ReservationDetails from "./pages/dining/ReservationDetails";
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
import AboutEditor from './pages/admin/AboutEditor';
import RestaurantManager from './pages/admin/RestaurantManager';
import RestaurantMenuManager from './pages/admin/RestaurantMenuManager';
import ReservationManager from './pages/admin/ReservationManager';
import ChatMessages from './pages/admin/ChatMessages';
import RequestManager from './pages/admin/RequestManager';
import Profile from './pages/profile/Profile';
import Notifications from './pages/notifications/Notifications';

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Page publique d'authentification */}
        <Route path="/auth/login" element={<Login />} />
        
        {/* Pages protégées nécessitant une authentification */}
        <Route element={<AuthGuard><Layout><Outlet /></Layout></AuthGuard>}>
          <Route path="/" element={<Index />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-room" element={<MyRoom />} />
          <Route path="/requests/:id" element={<ServiceRequestDetails />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/dining/:id" element={<RestaurantDetail />} />
          <Route path="/reservations/:id" element={<ReservationDetails />} />
          <Route path="/spa" element={<Spa />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="/admin/about" element={<AboutEditor />} />
          <Route path="/admin/restaurants" element={<RestaurantManager />} />
          <Route path="/admin/restaurants/:id/menu" element={<RestaurantMenuManager />} />
          <Route path="/admin/restaurants/:id/reservations" element={<ReservationManager />} />
          <Route path="/admin/chat-messages" element={<ChatMessages />} />
          <Route path="/admin/request-manager" element={<RequestManager />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/map" element={<HotelMap />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/events" element={<Events />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Redirection par défaut vers la connexion */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <AnimatedRoutes />
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
