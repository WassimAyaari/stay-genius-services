
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Notifications from '@/pages/notifications/Notifications';
import NotificationDetail from '@/pages/notifications/NotificationDetail';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Index /></Layout>} />
      
      {/* Pages principales */}
      <Route path="/events" element={<Layout><div>Page des événements</div></Layout>} />
      <Route path="/events/:id" element={<Layout><div>Détails de l'événement</div></Layout>} />
      <Route path="/dining" element={<Layout><div>Page de restauration</div></Layout>} />
      <Route path="/spa" element={<Layout><div>Page du spa</div></Layout>} />
      <Route path="/concierge" element={<Layout><div>Page du concierge</div></Layout>} />
      <Route path="/login" element={<div>Page de connexion</div>} />
      <Route path="/register" element={<div>Page d'inscription</div>} />
      <Route path="/forgot-password" element={<div>Page de mot de passe oublié</div>} />
      <Route path="/reset-password" element={<div>Page de réinitialisation du mot de passe</div>} />
      
      {/* Pages utilisateur */}
      <Route path="/profile" element={<Layout><div>Page de profil</div></Layout>} />
      <Route path="/dining/reservations" element={<Layout><div>Réservations de tables</div></Layout>} />
      <Route path="/spa/bookings" element={<Layout><div>Réservations de spa</div></Layout>} />
      <Route path="/requests" element={<Layout><div>Demandes de service</div></Layout>} />
      <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
      <Route path="/notifications/:type/:id" element={<Layout><NotificationDetail /></Layout>} />
      
      {/* Pages admin */}
      <Route path="/admin" element={<Layout><div>Tableau de bord admin</div></Layout>} />
      <Route path="/admin/restaurants" element={<Layout><div>Gestionnaire de restaurants</div></Layout>} />
      <Route path="/admin/restaurant-menus" element={<Layout><div>Gestionnaire de menus de restaurant</div></Layout>} />
      <Route path="/admin/events" element={<Layout><div>Gestionnaire d'événements</div></Layout>} />
      <Route path="/admin/service-requests" element={<Layout><div>Gestionnaire de demandes de service</div></Layout>} />
      <Route path="/admin/spa-services" element={<Layout><div>Gestionnaire de services de spa</div></Layout>} />
      <Route path="/admin/events-reservations" element={<Layout><div>Gestionnaire de réservations d'événements</div></Layout>} />
      
      {/* Route de secours pour 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
