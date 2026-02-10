
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsTab } from './components/events/EventsTab';
import { StoriesTab } from './components/events/StoriesTab';
import { EventReservationsTab } from './components/events/EventReservationsTab';

const EventsManager = () => {
  const [selectedEventId, setSelectedEventId] = React.useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = React.useState('events');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des Événements et Promotions</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full bg-muted">
          <TabsTrigger value="events" className="flex-1 py-3">Événements</TabsTrigger>
          <TabsTrigger value="reservations" className="flex-1 py-3">Réservations</TabsTrigger>
          <TabsTrigger value="stories" className="flex-1 py-3">Stories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <EventsTab />
        </TabsContent>

        <TabsContent value="reservations">
          <EventReservationsTab 
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
          />
        </TabsContent>
        
        <TabsContent value="stories">
          <StoriesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsManager;
