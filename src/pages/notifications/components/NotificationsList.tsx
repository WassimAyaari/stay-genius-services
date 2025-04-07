
import React from 'react';
import { NotificationCard } from './NotificationCard';
import type { NotificationItem } from '../types/notificationTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NotificationsListProps {
  notifications: NotificationItem[];
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }
  
  // Group notifications by type
  const allNotifications = notifications;
  const requestNotifications = notifications.filter(n => n.type === 'request');
  const reservationNotifications = notifications.filter(n => n.type === 'reservation');
  const spaNotifications = notifications.filter(n => n.type === 'spa_booking');
  const eventNotifications = notifications.filter(n => n.type === 'event_reservation');
  
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">
          Tous <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{allNotifications.length}</span>
        </TabsTrigger>
        <TabsTrigger value="requests">
          Demandes <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{requestNotifications.length}</span>
        </TabsTrigger>
        <TabsTrigger value="reservations">
          Restaurant <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{reservationNotifications.length}</span>
        </TabsTrigger>
        <TabsTrigger value="spa">
          Spa <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{spaNotifications.length}</span>
        </TabsTrigger>
        <TabsTrigger value="events">
          Événements <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{eventNotifications.length}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4 mt-2">
        {allNotifications.map((notification) => (
          <NotificationCard 
            key={`${notification.type}-${notification.id}`}
            notification={notification}
          />
        ))}
      </TabsContent>
      
      <TabsContent value="requests" className="space-y-4 mt-2">
        {requestNotifications.length > 0 ? (
          requestNotifications.map((notification) => (
            <NotificationCard 
              key={`${notification.type}-${notification.id}`}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Aucune demande de service</div>
        )}
      </TabsContent>
      
      <TabsContent value="reservations" className="space-y-4 mt-2">
        {reservationNotifications.length > 0 ? (
          reservationNotifications.map((notification) => (
            <NotificationCard 
              key={`${notification.type}-${notification.id}`}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Aucune réservation de restaurant</div>
        )}
      </TabsContent>
      
      <TabsContent value="spa" className="space-y-4 mt-2">
        {spaNotifications.length > 0 ? (
          spaNotifications.map((notification) => (
            <NotificationCard 
              key={`${notification.type}-${notification.id}`}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Aucune réservation de spa</div>
        )}
      </TabsContent>
      
      <TabsContent value="events" className="space-y-4 mt-2">
        {eventNotifications.length > 0 ? (
          eventNotifications.map((notification) => (
            <NotificationCard 
              key={`${notification.type}-${notification.id}`}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">Aucune réservation d'événement</div>
        )}
      </TabsContent>
    </Tabs>
  );
};
