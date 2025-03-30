
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useCreateRequestItem,
  useUpdateRequestItem
} from '@/hooks/useRequestCategories';
import { RequestCategory } from '@/features/rooms/types';
import { RequestsTab } from './requests/RequestsTab';
import { CategoriesTab } from './requests/CategoriesTab';
import { ItemsTab } from './requests/ItemsTab';
import { ItemForm } from '@/components/admin/requests/ItemForm';

const RequestManager = () => {
  const { toast } = useToast();
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [itemForm, setItemForm] = useState({ name: '', description: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const createItemMutation = useCreateRequestItem();
  const updateItemMutation = useUpdateRequestItem();
  
  const handleOpenItemDialog = (category: RequestCategory) => {
    setSelectedCategory(category);
    setItemForm({ name: '', description: '' });
    setIsUpdating(false);
    setItemDialogOpen(true);
  };
  
  const handleSubmitItem = async () => {
    if (!itemForm.name.trim() || !selectedCategory) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isUpdating) {
        toast({
          title: "Error",
          description: "Updating items is not implemented in this demo",
          variant: "destructive"
        });
      } else {
        await createItemMutation.mutateAsync({
          category_id: selectedCategory.id,
          name: itemForm.name,
          description: itemForm.description,
          is_active: true
        });
        toast({
          title: "Success",
          description: "Item created successfully"
        });
      }
      setItemDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-semibold mb-6">Request Management</h1>
      
      <Tabs defaultValue="requests">
        <TabsList className="mb-6">
          <TabsTrigger value="requests">Active Requests</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Request Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <RequestsTab />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
        
        <TabsContent value="items">
          <ItemsTab onAddItem={handleOpenItemDialog} />
        </TabsContent>
      </Tabs>
      
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Item to Category
            </DialogTitle>
          </DialogHeader>
          <ItemForm 
            selectedCategory={selectedCategory}
            itemForm={itemForm}
            setItemForm={setItemForm}
            onSubmit={handleSubmitItem}
            isLoading={createItemMutation.isPending || updateItemMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestManager;
