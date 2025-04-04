
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useNotificationDetail } from './hooks/useNotificationDetail';
import { NotificationDetailHeader } from './components/NotificationDetailHeader';
import { NotificationDetailContent } from './components/NotificationDetailContent';
import { Skeleton } from '@/components/ui/skeleton';

const NotificationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notification, isLoading, error } = useNotificationDetail(id);

  const handleBack = () => {
    navigate('/notifications');
  };

  const getNotificationTitle = () => {
    switch (notification?.type) {
      case 'request':
        return 'Demande de service';
      case 'reservation':
        return 'Réservation restaurant';
      case 'spa_booking':
        return 'Réservation spa';
      default:
        return 'Notification';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div onClick={handleBack} className="flex items-center mb-6 cursor-pointer">
            <span className="text-sm">← Retour aux notifications</span>
          </div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32 mb-8" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (error || !notification) {
    return (
      <Layout>
        <div className="container py-8">
          <div onClick={handleBack} className="flex items-center mb-6 cursor-pointer">
            <span className="text-sm">← Retour aux notifications</span>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h2 className="text-lg font-medium text-red-800 mb-2">Notification introuvable</h2>
            <p className="text-red-700">
              {error || "Nous n'avons pas pu trouver cette notification. Elle a peut-être été supprimée."}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Rediriger les réservations de restaurant vers la page dédiée
  if (notification.type === 'reservation' && notification.id) {
    if (window.location.pathname.includes('/notifications/')) {
      navigate(`/dining/reservation/${notification.id}`);
      return null;
    }
  }

  return (
    <Layout>
      <div className="container py-8">
        <NotificationDetailHeader
          title={getNotificationTitle()}
          type={notification.type}
          onBack={handleBack}
        />
        <NotificationDetailContent notification={notification} />
      </div>
    </Layout>
  );
};

export default NotificationDetail;
