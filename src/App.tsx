
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dining from './pages/dining/Dining';
import DiningDetail from './pages/dining/RestaurantDetail';
import Spa from './pages/spa/Spa';
import Events from './pages/events/Events';
import EventDetail from './pages/events/EventDetail';
import EventReservationDetail from './pages/events/EventReservationDetail';
import MyRoom from './pages/MyRoom';
import PropertyInfo from './pages/PropertyInfo';
import HotelMap from './pages/HotelMap';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AuthGuard from './components/AuthGuard';
import ChatView from './pages/ChatView';
import Concierge from './pages/Concierge';
import ServiceRequests from './pages/ServiceRequests';
import NotificationDetail from './pages/notifications/NotificationDetail';
import Notifications from './pages/notifications/Notifications';
import TableReservationDetail from './pages/dining/TableReservationDetail';
import SpaDetail from './pages/spa/SpaDetail';
import SpaBookingDetail from './pages/spa/SpaBookingDetail';
import RequestDetail from './pages/ServiceRequestDetail';

// Admin routes
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminGuard from './components/AdminGuard';
import AdminRequests from './pages/admin/Requests';
import AdminReservations from './pages/admin/Reservations';
import AdminSpaBookings from './pages/admin/SpaBookings';
import AdminChat from './pages/admin/Chat';
import AdminAbout from './pages/admin/About';
import AdminRestaurants from './pages/admin/Restaurants';
import AdminMenu from './pages/admin/Menu';
import AdminSpaServices from './pages/admin/SpaServices';
import AdminSpaFacilities from './pages/admin/SpaFacilities';
import AdminServiceCategories from './pages/admin/RequestCategories';
import EventsManager from './pages/admin/EventsManager';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/dining/:id" element={<DiningDetail />} />
        <Route path="/spa" element={<Spa />} />
        <Route path="/spa/:id" element={<SpaDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/info" element={<PropertyInfo />} />
        <Route path="/map" element={<HotelMap />} />
        <Route path="/auth/*" element={<Auth />} />

        {/* Protected User Routes */}
        <Route element={<AuthGuard />}>
          <Route path="/my-room" element={<MyRoom />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatView />} />
          <Route path="/concierge" element={<Concierge />} />
          <Route path="/service-requests" element={<ServiceRequests />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/:type/:id" element={<NotificationDetail />} />
          <Route path="/dining/reservations/:id" element={<TableReservationDetail />} />
          <Route path="/events/:id/reservation" element={<EventReservationDetail />} />
          <Route path="/events/reservation/:id" element={<EventReservationDetail />} />
          <Route path="/spa/booking/:id" element={<SpaBookingDetail />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index element={<AdminDashboard />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="spa-bookings" element={<AdminSpaBookings />} />
          <Route path="chat" element={<AdminChat />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="spa-services" element={<AdminSpaServices />} />
          <Route path="spa-facilities" element={<AdminSpaFacilities />} />
          <Route path="service-categories" element={<AdminServiceCategories />} />
          <Route path="events" element={<EventsManager />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
