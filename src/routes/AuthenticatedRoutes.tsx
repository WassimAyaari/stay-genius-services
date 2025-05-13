
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import Profile from '@/pages/profile/Profile';
import ServiceRequestDetails from '@/pages/my-room/ServiceRequestDetails';
import ReservationDetails from '@/pages/dining/ReservationDetails';
import SpaBookingDetails from '@/pages/spa/SpaBookingDetails';
import EventDetail from '@/pages/events/EventDetail';
import MyRoom from '@/pages/my-room/MyRoom';
import NotificationDetail from '@/pages/notifications/NotificationDetail';

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/profile" element={
        <AuthGuard>
          <Profile />
        </AuthGuard>
      } />
      
      <Route path="/requests/:id" element={
        <AuthGuard>
          <ServiceRequestDetails />
        </AuthGuard>
      } />
      
      <Route path="/dining/reservations/:id" element={
        <AuthGuard>
          <ReservationDetails />
        </AuthGuard>
      } />
      
      <Route path="/spa/booking/:id" element={
        <AuthGuard>
          <SpaBookingDetails />
        </AuthGuard>
      } />
      
      <Route path="/events/:id" element={
        <AuthGuard>
          <EventDetail />
        </AuthGuard>
      } />
      
      <Route path="/my-room" element={
        <AuthGuard>
          <MyRoom />
        </AuthGuard>
      } />
      
      <Route path="/notifications/:type/:id" element={
        <AuthGuard>
          <NotificationDetail />
        </AuthGuard>
      } />
    </Routes>
  );
};

export default AuthenticatedRoutes;
