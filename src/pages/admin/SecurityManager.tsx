
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRequestCategories, useCreateRequestItem } from '@/hooks/useRequestCategories';
import { RequestItem } from '@/features/rooms/types';
import SecurityItemsTab from './security/SecurityItemsTab';
import SecurityRequestsTab from './security/SecurityRequestsTab';
import AddItemDialog from './security/AddItemDialog';
import EditItemDialog from './security/EditItemDialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminNotifications } from '@/hooks/admin/useAdminNotifications';

const SecurityManager = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<RequestItem | null>(null);
  const { markSeen } = useAdminNotifications();
  const { toast } = useToast();
  
  const { categories } = useRequestCategories();
  const createItem = useCreateRequestItem();
  
  // Find the Security category
  const securityCategory = categories.find(cat => 
    cat.name?.toLowerCase().includes('secur') || 
    cat.name?.toLowerCase().includes('security')
  );
  
  // Get the category ID
  const categoryIds = securityCategory ? [securityCategory.id] : [];
  
  const createSecurityCategory = async () => {
    try {
      const result = await createItem.mutateAsync({
        name: 'Security',
        description: 'Security related requests',
        is_active: true,
        category_id: '', // This will be converted to a category
      });
      
      toast({
        title: "Success",
        description: "Security category created successfully"
      });
      
      return result;
    } catch (error) {
      console.error('Error creating security category:', error);
      toast({
        title: "Error",
        description: "Failed to create security category",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const openEditDialog = (item: RequestItem) => {
    setEditingItem(item);
    setIsEditItemDialogOpen(true);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Security Management</h1>
      
      <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); if (val === 'requests') markSeen('security'); }} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          <SecurityItemsTab 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            openAddItemDialog={() => setIsAddItemDialogOpen(true)}
            openEditDialog={openEditDialog}
            createSecurityCategory={createSecurityCategory}
          />
        </TabsContent>
        
        <TabsContent value="requests">
          <SecurityRequestsTab categoryIds={categoryIds} />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <AddItemDialog
        isOpen={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
        categoryId={securityCategory?.id || ''}
      />
      
      <EditItemDialog
        isOpen={isEditItemDialogOpen}
        onOpenChange={setIsEditItemDialogOpen}
        item={editingItem}
      />
    </div>
  );
};

export default SecurityManager;
