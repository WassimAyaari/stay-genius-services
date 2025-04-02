
import React from 'react';
import Layout from '@/components/Layout';
import { NotificationsList } from './components/NotificationsList';
import { EmptyState } from './components/EmptyState';
import { AuthPrompt } from './components/AuthPrompt';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications: React.FC = () => {
  const { notifications, isLoading, isAuthenticated } = useNotifications();

  // Show authentication prompt if user is not logged in
  if (!isAuthenticated) {
    return <AuthPrompt />;
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
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
