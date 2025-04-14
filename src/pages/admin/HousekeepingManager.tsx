import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RequestItem } from '@/features/rooms/types';
import { useRequestCategories, useCreateRequestItem, useUpdateRequestItem } from '@/hooks/useRequestCategories';
import { useRequestsData } from '@/hooks/useRequestsData';
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import HousekeepingItemsTab from './housekeeping/components/HousekeepingItemsTab';
import HousekeepingRequestsTab from './housekeeping/components/HousekeepingRequestsTab';
import AddItemDialog from './housekeeping/components/AddItemDialog';
import EditItemDialog from './housekeeping/components/EditItemDialog';

const HousekeepingManager = () => {
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
  
  // Find the Housekeeping category
  const housekeepingCategory = categories.find(cat => cat.name === 'Housekeeping');
  
  // Filter housekeeping requests
  const housekeepingRequests = requests.filter(
    req => {
      // Check if the request is related to housekeeping
      const isHousekeeping = 
        req.category_id === housekeepingCategory?.id || 
        req.type?.toLowerCase() === 'housekeeping' ||
        (req.request_items && req.request_items.category_id === housekeepingCategory?.id);
      
      return isHousekeeping;
    }
  );
  
  const handleAddItem = async () => {
    if (!housekeepingCategory) {
      toast({
        title: "Error",
        description: "Housekeeping category not found",
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
        category_id: housekeepingCategory.id
      });
      
      toast({
        title: "Success",
        description: "Item added successfully"
      });
      
      setNewItem({
        name: '',
        description: '',
        category_id: '',
        is_active: true
      });
      
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
      
      toast({
        title: "Success",
        description: "Item updated successfully"
      });
      
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
  
  const handleUpdateRequestStatus = async (requestId: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await updateRequestStatus(requestId, status);
      handleRefresh();
      
      toast({
        title: "Success",
        description: `Request marked as ${status}`
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
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Housekeeping Management</h1>
        
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {housekeepingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {housekeepingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="items">
            <HousekeepingItemsTab 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              openAddItemDialog={() => setIsAddItemDialogOpen(true)}
              openEditDialog={openEditDialog}
            />
          </TabsContent>
          
          <TabsContent value="requests">
            <HousekeepingRequestsTab
              requestsSearchTerm={requestsSearchTerm}
              setRequestsSearchTerm={setRequestsSearchTerm}
              handleUpdateRequestStatus={handleUpdateRequestStatus}
            />
          </TabsContent>
        </Tabs>
        
        {/* Add Item Dialog */}
        <AddItemDialog
          isOpen={isAddItemDialogOpen}
          onOpenChange={setIsAddItemDialogOpen}
          newItem={newItem}
          setNewItem={setNewItem}
          onAdd={handleAddItem}
        />
        
        {/* Edit Item Dialog */}
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

export default HousekeepingManager;
