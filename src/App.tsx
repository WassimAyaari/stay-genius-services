
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/hooks/useAuthContext';
import { ThemeProvider } from "next-themes";
import { Toaster } from 'sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';

import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import AuthGuard from '@/components/AuthGuard';
import Rooms from '@/pages/rooms/Rooms';
import RoomDetails from '@/pages/rooms/RoomDetails';
import MyRoom from '@/pages/my-room/MyRoom';
import Dining from '@/pages/dining/Dining';
import RestaurantDetail from '@/pages/dining/RestaurantDetail';
import Spa from '@/pages/spa/Spa';
import Activities from '@/pages/activities/Activities';
import Events from '@/pages/events/Events';
import EventDetail from '@/pages/events/EventDetail';
import Services from '@/pages/services/Services';
import Destination from '@/pages/destination/Destination';
import HotelMap from '@/pages/map/HotelMap';
import Profile from '@/pages/profile/Profile';
import About from '@/pages/about/About';
import ServiceRequestDetails from '@/pages/my-room/ServiceRequestDetails';
import NotFound from '@/pages/NotFound';
import Contact from '@/pages/Contact';
import Messages from '@/pages/messages/Messages';
import ReservationDetails from '@/pages/dining/ReservationDetails';
import Notifications from '@/pages/notifications/Notifications';
import NotificationDetail from '@/pages/notifications/NotificationDetail';
import Feedback from '@/pages/feedback/Feedback';
import Shops from '@/pages/shops/Shops';
import AdminDashboard from '@/pages/admin/Dashboard';
// RequestManager import removed
import ReservationManager from '@/pages/admin/ReservationManager';
import RestaurantManager from '@/pages/admin/RestaurantManager';
import RestaurantMenuManager from '@/pages/admin/RestaurantMenuManager';
import RestaurantReservationsManager from '@/pages/admin/RestaurantReservationsManager';
import SpaManager from '@/pages/admin/SpaManager';
import SpaBookingDetails from '@/pages/spa/SpaBookingDetails';
import ChatMessages from '@/pages/admin/ChatMessages';
import AboutEditor from '@/pages/admin/AboutEditor';
import EventsManager from '@/pages/admin/EventsManager';
import ShopsManager from '@/pages/admin/ShopsManager';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider attribute="class">
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/requests/:id" element={
                <AuthGuard>
                  <ServiceRequestDetails />
                </AuthGuard>
              } />
              
              <Route path="/dining/reservations/:id" element={
                <AuthGuard>
                  <ReservationDetails />
                </AuthGuard>
              } />
              
              <Route path="/spa/booking/:id" element={
                <AuthGuard>
                  <SpaBookingDetails />
                </AuthGuard>
              } />
              
              <Route path="/events/:id" element={
                <AuthGuard>
                  <EventDetail />
                </AuthGuard>
              } />
              
              <Route path="/my-room" element={
                <AuthGuard>
                  <MyRoom />
                </AuthGuard>
              } />
              
              <Route path="/dining" element={<Dining />} />
              <Route path="/dining/:id" element={<RestaurantDetail />} />
              <Route path="/spa" element={<Spa />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/events" element={<Events />} />
              <Route path="/services" element={<Services />} />
              <Route path="/destination" element={<Destination />} />
              <Route path="/map" element={<HotelMap />} />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/notifications/:type/:id" element={
                <AuthGuard>
                  <NotificationDetail />
                </AuthGuard>
              } />
              
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/shops" element={<Shops />} />
              
              <Route path="/admin" element={
                <AuthGuard adminRequired={true}>
                  <AdminDashboard />
                </AuthGuard>
              } />
              
              {/* Route for RequestManager removed */}
              
              <Route path="/admin/reservations" element={
                <AuthGuard adminRequired={true}>
                  <ReservationManager />
                </AuthGuard>
              } />
              
              <Route path="/admin/restaurants" element={
                <AuthGuard adminRequired={true}>
                  <RestaurantManager />
                </AuthGuard>
              } />
              
              <Route path="/admin/restaurants/:id/reservations" element={
                <AuthGuard adminRequired={true}>
                  <RestaurantReservationsManager />
                </AuthGuard>
              } />
              
              <Route path="/admin/restaurant-menus" element={
                <AuthGuard adminRequired={true}>
                  <RestaurantMenuManager />
                </AuthGuard>
              } />
              
              <Route path="/admin/spa" element={
                <AuthGuard adminRequired={true}>
                  <SpaManager />
                </AuthGuard>
              } />
              
              <Route path="/admin/events" element={
                <AuthGuard adminRequired={true}>
                  <EventsManager />
                </AuthGuard>
              } />
              
              <Route path="/admin/shops" element={
                <AuthGuard adminRequired={true}>
                  <ShopsManager />
                </AuthGuard>
              } />
              
              <Route path="/admin/chat" element={
                <AuthGuard adminRequired={true}>
                  <ChatMessages />
                </AuthGuard>
              } />
              
              <Route path="/admin/about" element={
                <AuthGuard adminRequired={true}>
                  <AboutEditor />
                </AuthGuard>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster richColors position="top-right" closeButton />
            <ShadcnToaster />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
