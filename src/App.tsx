
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Index from '@/pages/Index';
import About from './pages/About';
import Services from '@/pages/services/Services';
import HotelMap from '@/pages/map/HotelMap';
import Contact from '@/pages/Contact';
import Messages from './pages/Messages';
import MyRoom from '@/pages/my-room/MyRoom';
import ServiceRequestDetails from './pages/service-request/ServiceRequestDetails';
import Rooms from '@/pages/rooms/Rooms';
import RoomDetails from '@/pages/rooms/RoomDetails';
import Dining from '@/pages/dining/Dining';
import RestaurantDetail from '@/pages/dining/RestaurantDetail';
import ReservationDetails from '@/pages/dining/ReservationDetails';
import Spa from '@/pages/spa/Spa';
import SpaBookingDetails from '@/pages/spa/SpaBookingDetails';
import Events from '@/pages/events/Events';
import EventDetail from '@/pages/events/EventDetail';
import Shops from '@/pages/shops/Shops';
import Activities from '@/pages/activities/Activities';
import Destination from '@/pages/destination/Destination';
import Login from '@/pages/auth/Login';
import Profile from './pages/auth/Profile';
import Feedback from './pages/Feedback';
import Notifications from '@/pages/notifications/Notifications';
import NotificationDetail from '@/pages/notifications/NotificationDetail';
import AdminDashboard from '@/pages/admin/Dashboard';
import RequestManager from '@/pages/admin/RequestManager';
import RestaurantManager from '@/pages/admin/RestaurantManager';
import RestaurantMenuManager from '@/pages/admin/RestaurantMenuManager';
import EventsManager from '@/pages/admin/EventsManager';
import SpaManager from '@/pages/admin/SpaManager';
import ChatMessages from '@/pages/admin/ChatMessages';
import ShopsManager from '@/pages/admin/ShopsManager';
import RestaurantReservationsManager from '@/pages/admin/RestaurantReservationsManager';
import AboutEditor from '@/pages/admin/AboutEditor';
import NotFound from '@/pages/NotFound';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { useHotelConfig } from '@/hooks/useHotelConfig';
import { HotelConfigContext } from './contexts/HotelConfigContext';
import HousekeepingRequests from './pages/admin/housekeeping/HousekeepingRequests';
import MaintenanceRequests from './pages/admin/maintenance/MaintenanceRequests';
import ReceptionRequests from './pages/admin/reception/ReceptionRequests';

function App() {
  const { userData, isInitializing } = useAuth();
  const { isLoading: configIsLoading, config: hotelConfig } = useHotelConfig();
  const [isConfigReady, setIsConfigReady] = useState(false);

  useEffect(() => {
    if (!configIsLoading && !isInitializing) {
      setIsConfigReady(true);
    }
  }, [configIsLoading, isInitializing]);

  if (!isConfigReady) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ThemeProvider
        defaultTheme="system"
        storageKey="vite-react-theme"
      >
        <HotelConfigContext.Provider value={hotelConfig}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/map" element={<HotelMap />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/my-room" element={<MyRoom />} />
            <Route path="/service-request/:id" element={<ServiceRequestDetails />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/reservation/:id" element={<ReservationDetails />} />
            <Route path="/spa" element={<Spa />} />
            <Route path="/spa-booking/:id" element={<SpaBookingDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/destination" element={<Destination />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications/:id" element={<NotificationDetail />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/requests" element={<RequestManager />} />
            <Route path="/admin/housekeeping" element={<HousekeepingRequests />} />
            <Route path="/admin/maintenance" element={<MaintenanceRequests />} />
            <Route path="/admin/reception" element={<ReceptionRequests />} />
            <Route path="/admin/restaurants" element={<RestaurantManager />} />
            <Route path="/admin/menus" element={<RestaurantMenuManager />} />
            <Route path="/admin/events" element={<EventsManager />} />
            <Route path="/admin/spa" element={<SpaManager />} />
            <Route path="/admin/chat" element={<ChatMessages />} />
            <Route path="/admin/shops" element={<ShopsManager />} />
            <Route path="/admin/tables" element={<RestaurantReservationsManager />} />
            <Route path="/admin/about" element={<AboutEditor />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HotelConfigContext.Provider>
        <Toaster />
      </ThemeProvider>
    </Router>
  );
}

export default App;
