
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './features/auth/hooks/useAuthContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import Dining from './pages/dining/Dining';
import RestaurantDetail from './pages/dining/RestaurantDetail';
import Destination from './pages/destination/Destination';
import Home from './pages/Home';
import Notifications from './pages/notifications/Notifications';
import NotificationDetails from './pages/notifications/NotificationDetails';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/dining" element={<Dining />} />
            <Route path="/dining/:id" element={<RestaurantDetail />} />
            
            <Route path="/destination" element={<Destination />} />
            
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications/:type/:id" element={<NotificationDetails />} />
            
            {/* Catch all other routes with NotFound */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
