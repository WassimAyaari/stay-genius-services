
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SpaFacilitiesTab from './spa/SpaFacilitiesTab';
import SpaServicesTab from './spa/SpaServicesTab';
import SpaBookingsTab from './spa/SpaBookingsTab';
import Layout from '@/components/Layout';
import { useQueryClient } from '@tanstack/react-query';

export default function SpaManager() {
  const queryClient = useQueryClient();

  const refreshSpaData = () => {
    queryClient.invalidateQueries({ queryKey: ['spa-facilities'] });
    queryClient.invalidateQueries({ queryKey: ['spa-services'] });
    queryClient.invalidateQueries({ queryKey: ['spa-bookings'] });
  };

  React.useEffect(() => {
    refreshSpaData();
  }, []);

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Gestion du Spa</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les installations, services et réservations du spa
          </p>
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="facilities">Installations</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Réservations</CardTitle>
                <CardDescription>
                  Gérez les réservations de spa et leurs statuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpaBookingsTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <CardTitle>Installations</CardTitle>
                <CardDescription>
                  Gérez les différentes installations de spa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpaFacilitiesTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>
                  Gérez les services offerts dans chaque installation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpaServicesTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
