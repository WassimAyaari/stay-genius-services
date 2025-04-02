
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { SpaFacility } from '@/features/spa/types';
import SpaFacilityDialog from './SpaFacilityDialog';
import { useSpaFacilities } from '@/hooks/useSpaFacilities';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SpaFacilitiesTabProps {
  facilities: SpaFacility[];
  isLoading: boolean;
  onRefresh: () => void;
}

const SpaFacilitiesTab = ({ facilities, isLoading, onRefresh }: SpaFacilitiesTabProps) => {
  const { deleteFacility, isDeleting } = useSpaFacilities();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<SpaFacility | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<SpaFacility | null>(null);

  const handleAddFacility = () => {
    setSelectedFacility(null);
    setDialogOpen(true);
  };

  const handleEditFacility = (facility: SpaFacility) => {
    setSelectedFacility(facility);
    setDialogOpen(true);
  };

  const handleDeleteClick = (facility: SpaFacility) => {
    setFacilityToDelete(facility);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (facilityToDelete) {
      await deleteFacility(facilityToDelete.id);
      setDeleteDialogOpen(false);
      setFacilityToDelete(null);
      onRefresh();
    }
  };

  const handleDialogClose = (success: boolean) => {
    setDialogOpen(false);
    if (success) {
      onRefresh();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Installations Spa</h2>
        <Button onClick={handleAddFacility}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une installation
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : facilities.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Aucune installation spa trouvée</p>
            <Button onClick={handleAddFacility}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une installation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility) => (
            <Card key={facility.id} className="overflow-hidden">
              <div className="h-40 bg-gray-200">
                {facility.image_url ? (
                  <img
                    src={facility.image_url}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    Aucune image
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <p className="text-sm text-muted-foreground">{facility.location}</p>
                    <p className="mt-2 text-sm line-clamp-2">{facility.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditFacility(facility)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(facility)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <span>Capacité: {facility.capacity || '-'}</span>
                  <span className={`font-medium ${facility.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                    {facility.status === 'open' ? 'Ouvert' : 'Fermé'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <SpaFacilityDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        facility={selectedFacility}
        onClose={handleDialogClose}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement l'installation
              et tous les services associés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpaFacilitiesTab;
