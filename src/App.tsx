import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/features/auth/hooks/useAuthContext';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Dining from '@/pages/Dining';
import Spa from '@/pages/Spa';
import MyRoom from '@/pages/MyRoom';
import Admin from '@/pages/Admin';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { RequireAdmin } from '@/features/auth/components/RequireAdmin';
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register';
import DiningReservation from '@/features/dining/pages/DiningReservation';
import SpaBooking from '@/features/spa/pages/SpaBooking';
import Notifications from '@/pages/notifications/Notifications';
import NotificationDetails from '@/pages/notifications/NotificationDetails';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            
            <Route path="/dining" element={<RequireAuth><Dining /></RequireAuth>} />
            <Route path="/dining/reservation/:id" element={<RequireAuth><DiningReservation /></RequireAuth>} />
            
            <Route path="/spa" element={<RequireAuth><Spa /></RequireAuth>} />
            <Route path="/spa/booking/:id" element={<RequireAuth><SpaBooking /></RequireAuth>} />
            
            <Route path="/my-room" element={<RequireAuth><MyRoom /></RequireAuth>} />
            
            <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
            
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications/:type/:id" element={<NotificationDetails />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
