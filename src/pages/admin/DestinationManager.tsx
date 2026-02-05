
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DestinationsTab from '@/pages/admin/destinations/DestinationsTab';
import AttractionsTab from '@/pages/admin/destinations/AttractionsTab';
import ActivitiesTab from '@/pages/admin/destinations/ActivitiesTab';
import TransportationTab from '@/pages/admin/destinations/TransportationTab';

const DestinationManager = () => {
  const [activeTab, setActiveTab] = useState('destinations');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Destination Management</h1>
      
      <Tabs defaultValue="destinations" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="destinations">Discover Categories</TabsTrigger>
          <TabsTrigger value="attractions">Popular Attractions</TabsTrigger>
          <TabsTrigger value="activities">Things To Do</TabsTrigger>
          <TabsTrigger value="transportation">Transportation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="destinations">
          <DestinationsTab />
        </TabsContent>
        
        <TabsContent value="attractions">
          <AttractionsTab />
        </TabsContent>
        
        <TabsContent value="activities">
          <ActivitiesTab />
        </TabsContent>
        
        <TabsContent value="transportation">
          <TransportationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DestinationManager;
