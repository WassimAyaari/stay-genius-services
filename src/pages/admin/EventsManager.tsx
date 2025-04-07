
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventsTab } from './components/events/EventsTab';
import { StoriesTab } from './components/events/StoriesTab';

const EventsManager = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Gestion des Événements et Promotions</h1>
        
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="w-full bg-muted">
            <TabsTrigger value="events" className="flex-1 py-3">Événements</TabsTrigger>
            <TabsTrigger value="stories" className="flex-1 py-3">Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <EventsTab />
          </TabsContent>
          
          <TabsContent value="stories">
            <StoriesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventsManager;
