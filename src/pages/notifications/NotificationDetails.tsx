
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useNotificationDetail } from './hooks/useNotificationDetail';
import { NotificationDetailContent } from './components/NotificationDetailContent';
import { NotificationDetailHeader } from './components/NotificationDetailHeader';
import { NotFoundState } from './components/NotFoundState';
import { LoadingState } from './components/LoadingState';

const NotificationDetails = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { notification, isLoading, error } = useNotificationDetail(type, id);

  // Redirect if missing parameters
  useEffect(() => {
    if (!type || !id) {
      navigate('/notifications');
    }
  }, [type, id, navigate]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !notification) {
    return <NotFoundState onBack={() => navigate('/notifications')} />;
  }

  return (
    <Layout>
      <div className="container py-6 max-w-3xl">
        <NotificationDetailHeader 
          title={notification.title} 
          type={notification.type}
          onBack={() => navigate('/notifications')}
        />
        
        <NotificationDetailContent notification={notification} />
      </div>
    </Layout>
  );
};

export default NotificationDetails;
