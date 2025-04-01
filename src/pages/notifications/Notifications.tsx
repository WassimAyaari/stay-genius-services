
import React from 'react';
import Layout from '@/components/Layout';
import { useNotificationsData } from './hooks/useNotificationsData';
import { NotificationsList } from './components/NotificationsList';
import { LoadingState } from './components/LoadingState';
import { AuthPrompt } from './components/AuthPrompt';
import { EmptyState } from './components/EmptyState';

const Notifications = () => {
  const { notifications, isLoading, isAuthenticated } = useNotificationsData();

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Mes Notifications</h1>
        
        {isLoading ? (
          <LoadingState />
        ) : !isAuthenticated ? (
          <AuthPrompt />
        ) : notifications.length > 0 ? (
          <NotificationsList notifications={notifications} />
        ) : (
          <EmptyState />
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
