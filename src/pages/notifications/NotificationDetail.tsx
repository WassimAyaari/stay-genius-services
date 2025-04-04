
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { NotificationDetailHeader } from './components/NotificationDetailHeader';
import { NotificationDetailContent } from './components/NotificationDetailContent';
import { LoadingState } from './components/LoadingState';
import { NotFoundState } from './components/NotFoundState';
import { useNotificationDetail } from './hooks/useNotificationDetail';

const NotificationDetail: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { notification, isLoading, error } = useNotificationDetail(type, id);

  // Navigation handler
  const handleBack = () => {
    navigate('/notifications');
  };

  // Log des données de notification - utile pour le débogage
  useEffect(() => {
    if (notification) {
      console.log('Notification détail rendu avec:', notification.id, notification.type);
    }
    
    if (error) {
      console.error('Erreur de chargement notification:', error);
    }
  }, [notification, error]);

  // Afficher l'état de chargement pendant la récupération des données
  if (isLoading) {
    return <LoadingState />;
  }

  // Afficher l'état "non trouvé" s'il y a une erreur ou pas de notification
  if (error || !notification) {
    return (
      <NotFoundState 
        onBack={handleBack} 
        errorMessage={error instanceof Error ? error.message : String(error)}
      />
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <NotificationDetailHeader 
          title={notification.title}
          type={notification.type}
          onBack={handleBack}
        />
        
        <NotificationDetailContent notification={notification} />
      </div>
    </Layout>
  );
};

export default NotificationDetail;
