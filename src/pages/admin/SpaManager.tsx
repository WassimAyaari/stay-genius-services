
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, ChevronLeft, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SpaFacilitiesTab from './spa/SpaFacilitiesTab';
import SpaServicesTab from './spa/SpaServicesTab';
import SpaBookingsTab from './spa/SpaBookingsTab';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';

const SpaManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('facilities');
  const { facilities, isLoading, refetch } = useSpaFacilities();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Mise à jour réussie",
        description: "Les données ont été actualisées"
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'actualiser les données"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <a href="/admin">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </a>
          </Button>
          <h1 className="text-2xl font-bold">Gestion du Spa</h1>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Spa & Bien-être</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="facilities">Centres & Installations</TabsTrigger>
              <TabsTrigger value="services">Services & Traitements</TabsTrigger>
              <TabsTrigger value="bookings">Réservations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="facilities">
              <SpaFacilitiesTab facilities={facilities} isLoading={isLoading} onRefresh={refetch} />
            </TabsContent>
            
            <TabsContent value="services">
              <SpaServicesTab facilities={facilities} />
            </TabsContent>
            
            <TabsContent value="bookings">
              <SpaBookingsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpaManager;
