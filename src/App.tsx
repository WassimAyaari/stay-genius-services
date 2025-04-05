
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/hooks/useAuthContext';
import Notifications from '@/pages/notifications/Notifications';
import NotificationDetail from '@/pages/notifications/NotificationDetail';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/events" element={<div>Events Page</div>} />
      <Route path="/events/:id" element={<div>Event Details</div>} />
      <Route path="/dining" element={<div>Dining Page</div>} />
      <Route path="/spa" element={<div>Spa Page</div>} />
      <Route path="/concierge" element={<div>Concierge Page</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
      <Route path="/reset-password" element={<div>Reset Password Page</div>} />
      
      {/* User Pages */}
      <Route path="/profile" element={<div>Profile Page</div>} />
      <Route path="/dining/reservations" element={<div>Table Reservations Page</div>} />
      <Route path="/spa/bookings" element={<div>Spa Bookings Page</div>} />
      <Route path="/requests" element={<div>Service Requests Page</div>} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/notifications/:type/:id" element={<NotificationDetail />} />
      
      {/* Admin Pages */}
      <Route path="/admin" element={<div>Admin Dashboard</div>} />
      <Route path="/admin/restaurants" element={<div>Restaurants Manager</div>} />
      <Route path="/admin/restaurant-menus" element={<div>Restaurant Menu Manager</div>} />
      <Route path="/admin/events" element={<div>Events Manager</div>} />
      <Route path="/admin/service-requests" element={<div>Service Requests Manager</div>} />
      <Route path="/admin/spa-services" element={<div>Spa Services Manager</div>} />
      <Route path="/admin/events-reservations" element={<div>Events Reservation Manager</div>} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;
