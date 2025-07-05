
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/hooks/useAuthContext';

import { Toaster } from 'sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import PublicRoutes from './routes/PublicRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import AdminRoutes from './routes/AdminRoutes';
import './i18n';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<PublicRoutes />} />
            <Route path="/profile/*" element={<AuthenticatedRoutes />} />
            <Route path="/requests/*" element={<AuthenticatedRoutes />} />
            <Route path="/dining/reservations/*" element={<AuthenticatedRoutes />} />
            <Route path="/spa/booking/*" element={<AuthenticatedRoutes />} />
            <Route path="/events/*" element={<AuthenticatedRoutes />} />
            <Route path="/my-room/*" element={<AuthenticatedRoutes />} />
            <Route path="/notifications/*" element={<AuthenticatedRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Routes>
          <Toaster richColors position="top-right" closeButton />
          <ShadcnToaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
