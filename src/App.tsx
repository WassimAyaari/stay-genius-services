
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dining from './pages/dining/Dining';
import DiningDetail from './pages/dining/RestaurantDetail';
import Spa from './pages/spa/Spa';
import Events from './pages/events/Events';
import EventDetail from './pages/events/EventDetail';
import EventReservationDetail from './pages/events/EventReservationDetail';
import NotFound from './pages/NotFound';
import Notifications from './pages/notifications/Notifications';
import NotificationDetail from './pages/notifications/NotificationDetail';
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
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/:type/:id" element={<NotificationDetail />} />
        <Route path="/events/reservation/:id" element={<EventReservationDetail />} />
        <Route path="/events/:id/reservation" element={<EventReservationDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/events" element={<EventsManager />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
