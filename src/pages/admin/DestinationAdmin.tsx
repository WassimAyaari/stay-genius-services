
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const DestinationAdmin = () => {
  // Fetches
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['destinationCategories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('destination_categories').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: attractions, isLoading: loadingAttractions } = useQuery({
    queryKey: ['attractions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('attractions').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: activities, isLoading: loadingActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('destination_activities').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: carRentals, isLoading: loadingCarRentals } = useQuery({
    queryKey: ['carRentals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('car_rentals').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });

  const { data: transports, isLoading: loadingTransports } = useQuery({
    queryKey: ['publicTransport'],
    queryFn: async () => {
      const { data, error } = await supabase.from('public_transport').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });

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
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Catégories</h2>
              <Button>Ajouter</Button>
            </div>
            {loadingCategories ? (
              <p>Chargement…</p>
            ) : (
              <ul className="space-y-2">
                {categories?.map((cat:any) => (
                  <li key={cat.id} className="flex items-center gap-3">
                    {cat.icon && <img src={cat.icon} alt={cat.name} className="w-8 h-8 rounded" />}
                    <span>{cat.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="attractions">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Attractions</h2>
              <Button>Ajouter</Button>
            </div>
            {loadingAttractions ? (
              <p>Chargement…</p>
            ) : (
              <ul className="space-y-2">
                {attractions?.map((attr:any) => (
                  <li key={attr.id} className="flex items-center gap-3">
                    <img src={attr.image} className="w-12 h-8 object-cover rounded" alt={attr.name}/>
                    <span className="font-medium">{attr.name}</span>
                    <span className="text-xs text-gray-500">{attr.distance}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="activities">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Activités</h2>
              <Button>Ajouter</Button>
            </div>
            {loadingActivities ? (
              <p>Chargement…</p>
            ) : (
              <ul className="space-y-2">
                {activities?.map((act:any) => (
                  <li key={act.id} className="flex items-center gap-3">
                    <img src={act.image} className="w-12 h-8 object-cover rounded" alt={act.name}/>
                    <span className="font-medium">{act.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="carRentals">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Locations de Voiture</h2>
              <Button>Ajouter</Button>
            </div>
            {loadingCarRentals ? (
              <p>Chargement…</p>
            ) : (
              <ul className="space-y-2">
                {carRentals?.map((car:any) => (
                  <li key={car.id} className="flex items-center gap-3">
                    <span className="font-medium">{car.name}</span>
                    <span className="text-xs text-gray-500">{car.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="transports">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Transports</h2>
              <Button>Ajouter</Button>
            </div>
            {loadingTransports ? (
              <p>Chargement…</p>
            ) : (
              <ul className="space-y-2">
                {transports?.map((tr:any) => (
                  <li key={tr.id} className="flex items-center gap-3">
                    <span className="font-medium">{tr.name}</span>
                    <span className="text-xs text-gray-500">{tr.description}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DestinationAdmin;
