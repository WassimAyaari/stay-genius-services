
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRequestCategories, useSecurityCategory } from '@/hooks/useRequestCategories';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import { ServiceRequest } from '@/features/rooms/types';
import SecurityItemsTab from './security/SecurityItemsTab';
import AddItemDialog from './security/AddItemDialog';
import EditItemDialog from './security/EditItemDialog';
import { RequestItem } from '@/features/rooms/types';
import { useCreateRequestItem, useUpdateRequestItem } from '@/hooks/useRequestCategories';

const SecurityManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('requests');
  const { data: allRequests, isLoading, refetch } = useServiceRequests();
  const { categories } = useRequestCategories();
  const securityCategory = useSecurityCategory();

  const securityRequests = allRequests?.filter(
    request => request.category_id === securityCategory?.id
  ) || [];

  const pendingRequests = securityRequests.filter(req => req.status === 'pending');
  const inProgressRequests = securityRequests.filter(req => req.status === 'in_progress');
  const completedRequests = securityRequests.filter(req => req.status === 'completed');

  const handleStatusChange = async (requestId: string, newStatus: 'in_progress' | 'completed') => {
    try {
      toast({
        title: "Statut mis à jour",
        description: `Demande ${requestId} mise à jour avec le statut: ${newStatus}`,
      });
      refetch();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  const RequestCard = ({ request }: { request: ServiceRequest }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">
            Chambre {request.room_number || request.room_id}
          </CardTitle>
          <div className={`px-2 py-1 text-xs font-medium rounded-full 
            ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
              request.status === 'completed' ? 'bg-green-100 text-green-800' : 
              'bg-gray-100 text-gray-800'}`}
          >
            {request.status === 'pending' ? 'En attente' : 
             request.status === 'in_progress' ? 'En cours' : 
             request.status === 'completed' ? 'Complété' : 
             request.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{request.description}</p>
        <div className="text-xs text-gray-500 mb-3">
          Créé le {new Date(request.created_at).toLocaleString()}
        </div>
        <div className="flex justify-end gap-2">
          {request.status === 'pending' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleStatusChange(request.id, 'in_progress')}
            >
              Prendre en charge
            </Button>
          )}
          {request.status === 'in_progress' && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleStatusChange(request.id, 'completed')}
            >
              Marquer comme complété
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const [itemsTabSearch, setItemsTabSearch] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category_id: '',
    is_active: true
  });
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RequestItem | null>(null);
  const createItem = useCreateRequestItem();
  const updateItem = useUpdateRequestItem();

  const handleAddItem = async () => {
    if (!securityCategory) {
      toast({
        title: "Erreur",
        description: "Catégorie sécurité introuvable",
        variant: "destructive"
      });
      return;
    }
    if (!newItem.name) {
      toast({
        title: "Validation",
        description: "Le nom de l'item est requis",
        variant: "destructive"
      });
      return;
    }
    try {
      await createItem.mutateAsync({
        ...newItem,
        category_id: securityCategory.id
      });
      toast({
        title: "Succès",
        description: "Item ajouté avec succès"
      });
      setNewItem({
        name: '',
        description: '',
        category_id: '',
        is_active: true
      });
      setIsAddItemDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'item",
        variant: "destructive"
      });
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    try {
      await updateItem.mutateAsync(editingItem);
      toast({
        title: "Succès",
        description: "Item mis à jour"
      });
      setIsEditItemDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur mise à jour de l'item",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (item: RequestItem) => {
    setEditingItem(item);
    setIsEditItemDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Gestion de la Sécurité</h1>
        </div>

        <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="requests">Demandes de sécurité</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Chargement des demandes...</div>
            ) : securityRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <ShieldAlert className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-lg font-medium text-gray-900">Aucune demande de sécurité</p>
                  <p className="text-sm text-gray-500 max-w-md text-center mt-1">
                    Les demandes de sécurité soumises par les clients apparaîtront ici.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
                    En attente ({pendingRequests.length})
                  </h3>
                  {pendingRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
                
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
                    En cours ({inProgressRequests.length})
                  </h3>
                  {inProgressRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
                
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                    Complétés ({completedRequests.length})
                  </h3>
                  {completedRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="items">
            <SecurityItemsTab
              searchTerm={itemsTabSearch}
              setSearchTerm={setItemsTabSearch}
              openAddItemDialog={() => setIsAddItemDialogOpen(true)}
              openEditDialog={openEditDialog}
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Configurez les paramètres de sécurité et ajoutez des items de demande pour la catégorie sécurité.
                </p>
                
                {securityCategory ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Catégorie de sécurité</h3>
                    <p className="text-sm">ID: {securityCategory.id}</p>
                    <p className="text-sm">Nom: {securityCategory.name}</p>
                    <p className="text-sm">Description: {securityCategory.description || 'Aucune description'}</p>
                  </div>
                ) : (
                  <p>Aucune catégorie de sécurité trouvée.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AddItemDialog
          isOpen={isAddItemDialogOpen}
          onOpenChange={setIsAddItemDialogOpen}
          newItem={newItem}
          setNewItem={setNewItem}
          onAdd={handleAddItem}
        />

        <EditItemDialog
          isOpen={isEditItemDialogOpen}
          onOpenChange={setIsEditItemDialogOpen}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          onUpdate={handleUpdateItem}
        />
      </div>
    </Layout>
  );
};

export default SecurityManager;
