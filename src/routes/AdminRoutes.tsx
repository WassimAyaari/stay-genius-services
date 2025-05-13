
import React from 'react';
import { Route } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import AdminDashboard from '@/pages/admin/Dashboard';
import SecurityManager from '@/pages/admin/SecurityManager';
import HousekeepingManager from '@/pages/admin/HousekeepingManager';
import MaintenanceManager from '@/pages/admin/MaintenanceManager';
import ReservationManager from '@/pages/admin/ReservationManager';
import RestaurantManager from '@/pages/admin/RestaurantManager';
import RestaurantReservationsManager from '@/pages/admin/RestaurantReservationsManager';
import RestaurantMenuManager from '@/pages/admin/RestaurantMenuManager';
import SpaManager from '@/pages/admin/SpaManager';
import EventsManager from '@/pages/admin/EventsManager';
import ShopsManager from '@/pages/admin/ShopsManager';
import DestinationManager from '@/pages/admin/DestinationManager';
import ChatMessages from '@/pages/admin/ChatMessages';
import AboutEditor from '@/pages/admin/AboutEditor';
import FeedbackManager from '@/pages/admin/FeedbackManager';
import InformationTechnologyManager from '@/pages/admin/InformationTechnologyManager';
import RestaurantEventsManager from '@/pages/admin/RestaurantEventsManager';
import DestinationAdmin from '@/pages/admin/DestinationAdmin';

const AdminRoutes = () => {
  return (
    <>
      <Route path="/admin" element={
        <AuthGuard adminRequired={true}>
          <AdminDashboard />
        </AuthGuard>
      } />
      
      <Route path="/admin/security" element={
        <AuthGuard adminRequired={true}>
          <SecurityManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/housekeeping" element={
        <AuthGuard adminRequired={true}>
          <HousekeepingManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/maintenance" element={
        <AuthGuard adminRequired={true}>
          <MaintenanceManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/reservations" element={
        <AuthGuard adminRequired={true}>
          <ReservationManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/restaurants" element={
        <AuthGuard adminRequired={true}>
          <RestaurantManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/restaurants/:id/reservations" element={
        <AuthGuard adminRequired={true}>
          <RestaurantReservationsManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/restaurant-menus" element={
        <AuthGuard adminRequired={true}>
          <RestaurantMenuManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/spa" element={
        <AuthGuard adminRequired={true}>
          <SpaManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/events" element={
        <AuthGuard adminRequired={true}>
          <EventsManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/shops" element={
        <AuthGuard adminRequired={true}>
          <ShopsManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/destination" element={
        <AuthGuard adminRequired={true}>
          <DestinationManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/chat" element={
        <AuthGuard adminRequired={true}>
          <ChatMessages />
        </AuthGuard>
      } />
      
      <Route path="/admin/about" element={
        <AuthGuard adminRequired={true}>
          <AboutEditor />
        </AuthGuard>
      } />
      
      <Route path="/admin/feedback" element={
        <AuthGuard adminRequired={true}>
          <FeedbackManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/information-technology" element={
        <AuthGuard adminRequired={true}>
          <InformationTechnologyManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/restaurants/:id/events" element={
        <AuthGuard adminRequired={true}>
          <RestaurantEventsManager />
        </AuthGuard>
      } />
      
      <Route path="/admin/destination-admin" element={
        <AuthGuard adminRequired={true}>
          <DestinationAdmin />
        </AuthGuard>
      } />
    </>
  );
};

export default AdminRoutes;
