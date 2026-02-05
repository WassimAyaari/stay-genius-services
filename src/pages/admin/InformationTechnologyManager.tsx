import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RequestItem } from '@/features/rooms/types';
import { useRequestCategories, useCreateRequestItem, useUpdateRequestItem } from '@/hooks/useRequestCategories';
import { useRequestsData } from '@/hooks/useRequestsData';
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import InformationTechnologyItemsTab from './information-technology/components/InformationTechnologyItemsTab';
import InformationTechnologyRequestsTab from './information-technology/components/InformationTechnologyRequestsTab';
import AddItemDialog from './information-technology/components/AddItemDialog';
import EditItemDialog from './information-technology/components/EditItemDialog';

const InformationTechnologyManager = () => {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestsSearchTerm, setRequestsSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category_id: '',
    is_active: true
  });
  const [editingItem, setEditingItem] = useState<RequestItem | null>(null);

  const { toast } = useToast();
  const { categories } = useRequestCategories();
  const { requests, handleRefresh } = useRequestsData();
  const createItem = useCreateRequestItem();
  const updateItem = useUpdateRequestItem();

  const itCategory = categories.find(cat => cat.name === 'Information Technology');
  const itRequests = requests.filter(req => 
    req.category_id === itCategory?.id 
    || req.type?.toLowerCase().includes('information technology')
    || (req.request_items && req.request_items.category_id === itCategory?.id)
  );

  const handleAddItem = async () => {
    if (!itCategory) {
      toast({
        title: "Error",
        description: "Information Technology category not found",
        variant: "destructive"
      });
      return;
    }
    if (!newItem.name) {
      toast({
        title: "Validation Error",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }
    try {
      await createItem.mutateAsync({
        ...newItem,
        category_id: itCategory.id
      });
      toast({ title: "Success", description: "Item added successfully" });
      setNewItem({ name: '', description: '', category_id: '', is_active: true });
      setIsAddItemDialogOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive"
      });
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    try {
      await updateItem.mutateAsync(editingItem);
      toast({ title: "Success", description: "Item updated successfully" });
      setIsEditItemDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (item: RequestItem) => {
    setEditingItem(item);
    setIsEditItemDialogOpen(true);
  };

  const handleUpdateRequestStatus = async (requestId: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold') => {
    try {
      await updateRequestStatus(requestId, status);
      handleRefresh();
      toast({
        title: "Success",
        description: `Request marked as ${status.replace('_', ' ')}`
      });
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Information Technology Management</h1>
      <Tabs defaultValue="items" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {itRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <InformationTechnologyItemsTab 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openAddItemDialog={() => setIsAddItemDialogOpen(true)}
            openEditDialog={openEditDialog}
          />
        </TabsContent>
        <TabsContent value="requests">
          <InformationTechnologyRequestsTab
            requestsSearchTerm={requestsSearchTerm}
            setRequestsSearchTerm={setRequestsSearchTerm}
            handleUpdateRequestStatus={handleUpdateRequestStatus}
          />
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
  );
};

export default InformationTechnologyManager;
