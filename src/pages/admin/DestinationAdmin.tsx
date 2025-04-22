
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import des composants d'onglets
import DestinationsTab from './destinations/DestinationsTab';
import AttractionsTab from './destinations/AttractionsTab';
import ActivitiesTab from './destinations/ActivitiesTab';
import CarRentalsTab from './destinations/CarRentalsTab';
import PublicTransportsTab from './destinations/PublicTransportsTab';

const DestinationAdmin = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6 text-secondary">Administration - Destination</h1>
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="attractions">Attractions</TabsTrigger>
            <TabsTrigger value="activities">Activités</TabsTrigger>
            <TabsTrigger value="carRentals">Locations Voiture</TabsTrigger>
            <TabsTrigger value="transports">Transports</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <DestinationsTab />
          </TabsContent>

          <TabsContent value="attractions">
            <AttractionsTab />
          </TabsContent>

          <TabsContent value="activities">
            <ActivitiesTab />
          </TabsContent>

          <TabsContent value="carRentals">
            <CarRentalsTab />
          </TabsContent>

          <TabsContent value="transports">
            <PublicTransportsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DestinationAdmin;
