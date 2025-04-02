
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { SpaFacility } from '@/features/spa/types';
import { useSpaServices } from '@/hooks/useSpaServices';
import SpaServiceDialog from './SpaServiceDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface SpaServicesTabProps {
  facilities: SpaFacility[];
}

const SpaServicesTab = ({ facilities }: SpaServicesTabProps) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const { services, isLoading, refetch } = useSpaServices(selectedFacilityId || undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<any | null>(null);

  // Set the first facility as selected by default
  useEffect(() => {
    if (facilities && facilities.length > 0 && !selectedFacilityId) {
      setSelectedFacilityId(facilities[0].id);
    }
  }, [facilities, selectedFacilityId]);

  const handleFacilityChange = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setDialogOpen(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleDeleteClick = (service: any) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = (success: boolean) => {
    setDialogOpen(false);
    if (success) {
      refetch();
    }
  };

  const handleConfirmDelete = async () => {
    // TODO: Implement delete functionality
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Services & Traitements</h2>
          {facilities.length > 0 && (
            <Select
              value={selectedFacilityId || undefined}
              onValueChange={handleFacilityChange}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Sélectionner une installation" />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Button onClick={handleAddService} disabled={!selectedFacilityId}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un service
        </Button>
      </div>

      {!selectedFacilityId ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Veuillez d'abord créer une installation pour pouvoir ajouter des services
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.hash = "#facilities"}
            >
              Gérer les installations
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : !services || services.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Aucun service trouvé pour cette installation</p>
            <Button onClick={handleAddService}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {service.is_featured && (
                        <Star className="h-4 w-4 text-yellow-400" />
                      )}
                      {service.name}
                    </div>
                  </TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>{service.duration}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={service.status === 'available' ? 'default' : 'secondary'}
                      className={service.status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                      {service.status === 'available' ? 'Disponible' : 'Non disponible'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {dialogOpen && (
        <SpaServiceDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          service={selectedService}
          facilityId={selectedFacilityId || ''}
          onClose={handleDialogClose}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement ce service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpaServicesTab;
