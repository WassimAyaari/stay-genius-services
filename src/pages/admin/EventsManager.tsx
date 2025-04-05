
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsTab } from './components/events/EventsTab';
import { StoriesTab } from './components/events/StoriesTab';
import { EventReservationsTab } from './components/events/EventReservationsTab';
import { Separator } from '@/components/ui/separator';

const EventsManager = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  
  return (
    <Layout>
      <div className="container py-8 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <h1 className="text-2xl font-bold mb-2">Gestion des Événements et Promotions</h1>
        <p className="text-muted-foreground mb-6">Gérez vos événements, promotions, réservations et stories</p>
        <Separator className="mb-6" />
        
        <Tabs defaultValue="events" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mb-6">
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="flex-1 overflow-hidden flex flex-col">
            <EventsTab />
          </TabsContent>

          <TabsContent value="reservations" className="flex-1 overflow-hidden">
            <EventReservationsTab 
              selectedEventId={selectedEventId}
              setSelectedEventId={setSelectedEventId}
            />
          </TabsContent>
          
          <TabsContent value="stories" className="flex-1 overflow-hidden flex flex-col">
            <StoriesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventsManager;
