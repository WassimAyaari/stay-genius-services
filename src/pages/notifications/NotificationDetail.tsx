
import React from 'react';
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

  // Show loading state while fetching data
  if (isLoading) {
    return <LoadingState />;
  }

  // Show not found state if there's an error or no notification
  if (error || !notification) {
    return <NotFoundState onBack={handleBack} />;
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
