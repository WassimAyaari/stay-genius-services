
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import HotelManagement from './pages/admin/HotelManagement';
import HotelEdit from './pages/admin/HotelEdit';
import HotelInterface from './pages/admin/HotelInterface';
import HotelView from './pages/hotels/HotelView';
import HotelAdminGate from './components/HotelAdminGate';
import Unauthorized from './pages/Unauthorized';

// Pages d'administration d'hôtel
import HotelDashboard from './pages/hotels/admin/HotelDashboard';
import HotelRooms from './pages/hotels/admin/HotelRooms';
import HotelServices from './pages/hotels/admin/HotelServices';
import HotelDining from './pages/hotels/admin/HotelDining';
import HotelEvents from './pages/hotels/admin/HotelEvents';
import HotelStaff from './pages/hotels/admin/HotelStaff';
import HotelSettings from './pages/hotels/admin/HotelSettings';

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Routes publiques */}
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
          <Route path="/hotels/:id" element={<HotelView />} />
          <Route path="/admin/hotels" element={<HotelManagement />} />
          <Route path="/admin/hotels/:id/edit" element={<HotelEdit />} />
          <Route path="/admin/hotels/:id/interface" element={<HotelInterface />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Routes d'administration d'hôtel (multi-tenancy) */}
        <Route path="/admin/hotels/:hotelId" element={<HotelAdminGate />}>
          <Route index element={<HotelDashboard />} />
          <Route path="interface" element={<HotelDashboard />} />
          <Route path="rooms" element={<HotelRooms />} />
          <Route path="services" element={<HotelServices />} />
          <Route path="dining" element={<HotelDining />} />
          <Route path="events" element={<HotelEvents />} />
          <Route path="staff" element={<HotelStaff />} />
          <Route path="settings" element={<HotelSettings />} />
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
          <AnimatedRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
