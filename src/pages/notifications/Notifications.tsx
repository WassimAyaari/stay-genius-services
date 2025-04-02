
import React from 'react';
import Layout from '@/components/Layout';
import { useNotificationsData } from './hooks/useNotificationsData';
import { NotificationsList } from './components/NotificationsList';
import { LoadingState } from './components/LoadingState';
import { AuthPrompt } from './components/AuthPrompt';
import { EmptyState } from './components/EmptyState';
import { Card } from '@/components/ui/card';

const Notifications = () => {
  const { 
    notifications, 
    isLoading, 
    isAuthenticated, 
    userRoomNumber,
    error
  } = useNotificationsData();

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mes Notifications</h1>
          {userRoomNumber && (
            <div className="text-sm text-gray-600">
              Numéro de chambre: <span className="font-medium">{userRoomNumber}</span>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <LoadingState />
        ) : !isAuthenticated ? (
          <AuthPrompt />
        ) : error ? (
          <Card className="p-6 text-center">
            <p className="text-gray-600">Une erreur est survenue lors du chargement des notifications.</p>
            <p className="text-sm text-gray-500 mt-2">Veuillez réessayer plus tard.</p>
          </Card>
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
