import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Events from '@/pages/Events';
import Dining from '@/pages/Dining';
import Spa from '@/pages/Spa';
import Concierge from '@/pages/Concierge';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import { AuthProvider } from '@/features/auth/hooks/useAuthContext';
import { AdminRoute } from '@/components/routes/AdminRoute';
import { UserRoute } from '@/components/routes/UserRoute';
import RestaurantsManager from '@/pages/admin/RestaurantsManager';
import RestaurantMenuManager from '@/pages/admin/RestaurantMenuManager';
import EventsManager from '@/pages/admin/EventsManager';
import ServiceRequestsManager from '@/pages/admin/ServiceRequestsManager';
import SpaServicesManager from '@/pages/admin/SpaServicesManager';
import TableReservations from '@/pages/dining/TableReservations';
import SpaBookings from '@/pages/spa/SpaBookings';
import ServiceRequests from '@/pages/concierge/ServiceRequests';
import Notifications from '@/pages/notifications/Notifications';
import EventDetails from '@/pages/EventDetails';
import { NotificationsProvider } from '@/hooks/notifications/useNotificationsState';
import EventReservationsManager from '@/pages/admin/EventReservationsManager';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/dining" element={<Dining />} />
      <Route path="/spa" element={<Spa />} />
      <Route path="/concierge" element={<Concierge />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* User Pages */}
      <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
      <Route path="/dining/reservations" element={<UserRoute><TableReservations /></UserRoute>} />
      <Route path="/spa/bookings" element={<UserRoute><SpaBookings /></UserRoute>} />
      <Route path="/requests" element={<UserRoute><ServiceRequests /></UserRoute>} />
      <Route path="/notifications" element={<UserRoute><Notifications /></UserRoute>} />
      
      {/* Admin Pages */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/restaurants" element={<AdminRoute><RestaurantsManager /></AdminRoute>} />
      <Route path="/admin/restaurant-menus" element={<AdminRoute><RestaurantMenuManager /></AdminRoute>} />
      <Route path="/admin/events" element={<AdminRoute><EventsManager /></AdminRoute>} />
      <Route path="/admin/service-requests" element={<AdminRoute><ServiceRequestsManager /></AdminRoute>} />
      <Route path="/admin/spa-services" element={<AdminRoute><SpaServicesManager /></AdminRoute>} />
      <Route path="/admin/events-reservations" element={<AdminRoute><EventReservationsManager /></AdminRoute>} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
