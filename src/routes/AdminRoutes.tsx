
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
    <Routes>
      <Route path="/" element={
        <AuthGuard adminRequired={true}>
          <AdminDashboard />
        </AuthGuard>
      } />
      
      <Route path="/security" element={
        <AuthGuard adminRequired={true}>
          <SecurityManager />
        </AuthGuard>
      } />
      
      <Route path="/housekeeping" element={
        <AuthGuard adminRequired={true}>
          <HousekeepingManager />
        </AuthGuard>
      } />
      
      <Route path="/maintenance" element={
        <AuthGuard adminRequired={true}>
          <MaintenanceManager />
        </AuthGuard>
      } />
      
      <Route path="/reservations" element={
        <AuthGuard adminRequired={true}>
          <ReservationManager />
        </AuthGuard>
      } />
      
      <Route path="/restaurants" element={
        <AuthGuard adminRequired={true}>
          <RestaurantManager />
        </AuthGuard>
      } />
      
      <Route path="/restaurants/:id/reservations" element={
        <AuthGuard adminRequired={true}>
          <RestaurantReservationsManager />
        </AuthGuard>
      } />
      
      <Route path="/restaurant-menus" element={
        <AuthGuard adminRequired={true}>
          <RestaurantMenuManager />
        </AuthGuard>
      } />
      
      <Route path="/spa" element={
        <AuthGuard adminRequired={true}>
          <SpaManager />
        </AuthGuard>
      } />
      
      <Route path="/events" element={
        <AuthGuard adminRequired={true}>
          <EventsManager />
        </AuthGuard>
      } />
      
      <Route path="/shops" element={
        <AuthGuard adminRequired={true}>
          <ShopsManager />
        </AuthGuard>
      } />
      
      <Route path="/destination" element={
        <AuthGuard adminRequired={true}>
          <DestinationManager />
        </AuthGuard>
      } />
      
      <Route path="/chat" element={
        <AuthGuard adminRequired={true}>
          <ChatMessages />
        </AuthGuard>
      } />
      
      <Route path="/about" element={
        <AuthGuard adminRequired={true}>
          <AboutEditor />
        </AuthGuard>
      } />
      
      <Route path="/feedback" element={
        <AuthGuard adminRequired={true}>
          <FeedbackManager />
        </AuthGuard>
      } />
      
      <Route path="/information-technology" element={
        <AuthGuard adminRequired={true}>
          <InformationTechnologyManager />
        </AuthGuard>
      } />
      
      <Route path="/restaurants/:id/events" element={
        <AuthGuard adminRequired={true}>
          <RestaurantEventsManager />
        </AuthGuard>
      } />
      
      <Route path="/destination-admin" element={
        <AuthGuard adminRequired={true}>
          <DestinationAdmin />
        </AuthGuard>
      } />
    </Routes>
  );
};

export default AdminRoutes;
