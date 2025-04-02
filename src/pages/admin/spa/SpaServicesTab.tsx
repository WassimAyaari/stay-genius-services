
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useSpaServices } from '@/hooks/useSpaServices';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';
import { SpaService } from '@/features/spa/types';
import SpaServiceDialog from './SpaServiceDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function SpaServicesTab() {
  const [selectedService, setSelectedService] = useState<SpaService | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { services, isLoading, error, refetch } = useSpaServices();
  const { facilities, isLoading: isLoadingFacilities } = useSpaFacilities();

  // Map to store facility names by id
  const facilityNames = facilities.reduce((acc, facility) => {
    acc[facility.id] = facility.name;
    return acc;
  }, {} as Record<string, string>);

  const handleAddNew = () => {
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (service: SpaService) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const deleteService = async (id: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('spa_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Service supprimé avec succès');
      refetch();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteService(deleteId);
    }
  };

  const handleDialogClose = (success: boolean) => {
    setIsDialogOpen(false);
    if (success) {
      refetch();
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'massage': return 'Massage';
      case 'facial': return 'Soin du visage';
      case 'body': return 'Soin du corps';
      case 'wellness': return 'Bien-être';
      default: return category;
    }
  };

  const renderServiceCard = (service: SpaService) => (
    <Card key={service.id} className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {facilityNames[service.facility_id] || 'Installation inconnue'}
          </div>
        </div>
        <div className="flex space-x-2 items-center">
          {service.is_featured && (
            <Badge variant="outline" className="mr-2 bg-amber-100 text-amber-800 border-amber-200">
              Mis en avant
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleEdit(service)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleDeleteClick(service.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement le service "{service.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Détails</h4>
            <div className="text-sm text-muted-foreground">
              <p>Durée: {service.duration}</p>
              <p>Prix: {service.price} €</p>
              <p>Catégorie: {getCategoryLabel(service.category)}</p>
              <p>Status: <span className={service.status === 'available' ? 'text-green-500' : 'text-red-500'}>
                {service.status === 'available' ? 'Disponible' : 'Indisponible'}
              </span></p>
            </div>
          </div>
        </div>
        {service.image && (
          <div className="mt-4">
            <img 
              src={service.image} 
              alt={service.name} 
              className="h-32 w-auto object-cover rounded-md" 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Services Spa</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleAddNew} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
      
      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Erreur lors du chargement des services: {error.message}
          </AlertDescription>
        </Alert>
      ) : isLoading || isLoadingFacilities ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Aucun service trouvé</p>
          <Button onClick={handleAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un service
          </Button>
        </div>
      ) : (
        <div>
          {services.map(renderServiceCard)}
        </div>
      )}

      <SpaServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={selectedService}
        facilities={facilities}
        onClose={handleDialogClose}
      />
    </div>
  );
}
