
import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/hooks/useAuthContext';
import { ThemeProvider } from "next-themes";
import { Toaster } from 'sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import PublicRoutes from './routes/PublicRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import AdminRoutes from './routes/AdminRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider attribute="class">
          <AuthProvider>
            <Routes>
              <PublicRoutes />
              <AuthenticatedRoutes />
              <AdminRoutes />
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
