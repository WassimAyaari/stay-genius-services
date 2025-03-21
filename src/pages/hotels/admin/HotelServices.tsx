import React, { useState, useEffect } from 'react';
import { useHotel } from '@/context/HotelContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { HotelService } from '@/lib/types';

const HotelServices = () => {
  const { hotel, loading } = useHotel();
  const [services, setServices] = useState<HotelService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingService, setEditingService] = useState<HotelService | null>(null);

  useEffect(() => {
    if (hotel) {
      fetchServices();
    }
  }, [hotel]);

  const fetchServices = async () => {
    if (!hotel) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hotel_services')
        .select('*')
        .eq('hotel_id', hotel.id)
        .eq('status', 'active')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les services de l'hôtel",
        });
      } else {
        setServices(data || []);
      }
    } catch (err) {
      console.error('Error in fetchServices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveService = async (service: HotelService) => {
    if (!hotel) return;
    
    try {
      setIsSaving(true);
      
      const serviceData = {
        ...service,
        hotel_id: hotel.id
      };
      
      let result;
      
      if (service.id) {
        result = await supabase
          .from('hotel_services')
          .update(serviceData)
          .eq('id', service.id);
      } else {
        result = await supabase
          .from('hotel_services')
          .insert({
            ...serviceData,
            status: 'active',
            display_order: services.length
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "Succès",
        description: service.id ? "Service mis à jour" : "Service créé",
      });
      
      fetchServices();
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder le service",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }
    
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('hotel_services')
        .update({ status: 'inactive' })
        .eq('id', serviceId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Succès",
        description: "Service supprimé",
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le service",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const createEmptyService = (): HotelService => ({
    id: '',
    hotel_id: hotel.id,
    title: '',
    description: '',
    icon: 'coffee',
    action_text: 'En savoir plus',
    action_link: '#',
    type: 'main',
    display_order: services.length,
    status: 'active'
  });

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hotel) {
    return <div>Hôtel non trouvé</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des services</h1>
        <Button onClick={() => setEditingService(createEmptyService())}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>

      {editingService && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingService.id ? 'Modifier le service' : 'Nouveau service'}</CardTitle>
            <CardDescription>Personnalisez les informations du service</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              handleSaveService(editingService);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input 
                    id="title" 
                    value={editingService.title} 
                    onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icône (nom de l'icône Lucide)</Label>
                  <Input 
                    id="icon" 
                    value={editingService.icon} 
                    onChange={(e) => setEditingService({...editingService, icon: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={editingService.description} 
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  required
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="action_text">Texte du bouton</Label>
                  <Input 
                    id="action_text" 
                    value={editingService.action_text} 
                    onChange={(e) => setEditingService({...editingService, action_text: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action_link">Lien du bouton</Label>
                  <Input 
                    id="action_link" 
                    value={editingService.action_link} 
                    onChange={(e) => setEditingService({...editingService, action_link: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditingService(null)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{service.description}</p>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingService(service)}
                >
                  Modifier
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteService(service.id)}
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {services.length === 0 && !isLoading && (
        <div className="bg-gray-100 rounded-md p-8 text-center mt-4">
          <p className="text-gray-500">Aucun service n'a été ajouté pour cet hôtel.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setEditingService(createEmptyService())}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter votre premier service
          </Button>
        </div>
      )}
    </div>
  );
};

export default HotelServices;
