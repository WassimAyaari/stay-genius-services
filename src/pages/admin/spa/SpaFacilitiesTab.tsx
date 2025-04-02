
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';
import { SpaFacility } from '@/features/spa/types';
import SpaFacilityDialog from './SpaFacilityDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function SpaFacilitiesTab() {
  const [selectedFacility, setSelectedFacility] = useState<SpaFacility | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { 
    facilities, 
    isLoading, 
    error, 
    deleteFacility, 
    isDeleting,
    refetch
  } = useSpaFacilities();

  const handleAddNew = () => {
    setSelectedFacility(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (facility: SpaFacility) => {
    setSelectedFacility(facility);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteFacility(deleteId);
      setDeleteId(null);
    }
  };

  const handleDialogClose = (success: boolean) => {
    setIsDialogOpen(false);
    if (success) {
      refetch();
    }
  };

  const renderFacilityCard = (facility: SpaFacility) => (
    <Card key={facility.id} className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">{facility.name}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">{facility.location}</div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleEdit(facility)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleDeleteClick(facility.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement l'installation "{facility.name}" et tous les services associés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Supprimer
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
            <p className="text-sm text-muted-foreground">{facility.description || 'Aucune description'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Détails</h4>
            <div className="text-sm text-muted-foreground">
              <p>Heures d'ouverture: {facility.opening_hours || 'Non spécifiées'}</p>
              <p>Capacité: {facility.capacity || 'Non spécifiée'}</p>
              <p>Status: <span className={facility.status === 'open' ? 'text-green-500' : 'text-red-500'}>
                {facility.status === 'open' ? 'Ouvert' : 'Fermé'}
              </span></p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Installations Spa</h2>
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
            Erreur lors du chargement des installations: {error.message}
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
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
      ) : facilities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Aucune installation trouvée</p>
          <Button onClick={handleAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une installation
          </Button>
        </div>
      ) : (
        <div>
          {facilities.map(renderFacilityCard)}
        </div>
      )}

      <SpaFacilityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        facility={selectedFacility}
        onClose={handleDialogClose}
      />
    </div>
  );
}
