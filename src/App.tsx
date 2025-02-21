import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import RoomDetails from "./pages/rooms/RoomDetails";
import MyRoom from "./pages/my-room/MyRoom";
import Dining from "./pages/dining/Dining";
import Spa from "./pages/spa/Spa";
import Activities from "./pages/activities/Activities";
import Services from "./pages/services/Services";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import Layout from './components/Layout';
import Messages from './pages/messages/Messages';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AuthGuard>
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/rooms/:id" element={<RoomDetails />} />
              <Route path="/my-room" element={<MyRoom />} />
              <Route path="/dining" element={<Dining />} />
              <Route path="/spa" element={<Spa />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthGuard>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
