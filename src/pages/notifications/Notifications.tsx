
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useNotificationsData } from './hooks/useNotificationsData';
import { NotificationsList } from './components/NotificationsList';
import { LoadingState } from './components/LoadingState';
import { AuthPrompt } from './components/AuthPrompt';
import { EmptyState } from './components/EmptyState';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Notifications = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { 
    notifications, 
    isLoading, 
    isAuthenticated, 
    userRoomNumber,
    refetchRequests,
    refetchReservations,
    refetchSpaBookings
  } = useNotificationsData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchRequests(),
        refetchReservations(),
        refetchSpaBookings && refetchSpaBookings()
      ].filter(Boolean));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mes Notifications</h1>
          <div className="flex items-center gap-4">
            {userRoomNumber && (
              <div className="text-sm text-gray-600">
                Numéro de chambre: <span className="font-medium">{userRoomNumber}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${(isLoading || isRefreshing) ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </Button>
          </div>
        </div>
        
        {(isLoading || isRefreshing) ? (
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
