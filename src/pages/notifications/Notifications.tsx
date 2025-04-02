
import React from 'react';
import Layout from '@/components/Layout';
import { useNotificationsData } from './hooks/useNotificationsData';
import { NotificationsList } from './components/NotificationsList';
import { LoadingState } from './components/LoadingState';
import { AuthPrompt } from './components/AuthPrompt';
import { EmptyState } from './components/EmptyState';
import { Card } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const { 
    notifications, 
    isLoading, 
    isAuthenticated, 
    userRoomNumber,
    error
  } = useNotificationsData();

  // Debug log
  console.log("Notifications render:", {
    count: notifications?.length || 0,
    isLoading,
    isAuthenticated,
    hasError: !!error
  });

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Mes Notifications</h1>
          </div>
          {userRoomNumber && (
            <div className="text-sm text-gray-600">
              Chambre: <span className="font-medium">{userRoomNumber}</span>
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
        ) : notifications && notifications.length > 0 ? (
          <NotificationsList notifications={notifications} />
        ) : (
          <EmptyState />
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
