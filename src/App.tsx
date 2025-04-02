
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
import Profile from './pages/profile/Profile';
import AuthGuard from './components/AuthGuard';
import AdminDashboard from './pages/admin/Dashboard';
import ChatMessages from './pages/admin/ChatMessages';
import SpaManager from './pages/admin/SpaManager';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth/login" element={<Home />} />
            
            {/* Dining routes */}
            <Route path="/dining" element={<Dining />} />
            <Route path="/dining/:id" element={<RestaurantDetail />} />
            
            {/* Destination route */}
            <Route path="/destination" element={<Destination />} />
            
            {/* Profile route - protected */}
            <Route path="/profile" element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            } />
            
            {/* My Room route - protected */}
            <Route path="/my-room" element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            } />
            
            {/* Notification routes */}
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notifications/:type/:id" element={<NotificationDetails />} />
            
            {/* Admin routes - protected */}
            <Route path="/admin" element={
              <AuthGuard adminRequired={true}>
                <AdminDashboard />
              </AuthGuard>
            } />
            <Route path="/admin/chat" element={
              <AuthGuard adminRequired={true}>
                <ChatMessages />
              </AuthGuard>
            } />
            <Route path="/admin/spa" element={
              <AuthGuard adminRequired={true}>
                <SpaManager />
              </AuthGuard>
            } />
            
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
