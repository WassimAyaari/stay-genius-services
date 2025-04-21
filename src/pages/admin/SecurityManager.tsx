
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRequestCategories, useSecurityCategory, useCreateRequestCategory } from '@/hooks/useRequestCategories';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Button } from '@/components/ui/button';
import SecurityItemsTab from './security/SecurityItemsTab';
import AddItemDialog from './security/AddItemDialog';
import EditItemDialog from './security/EditItemDialog';
import { RequestItem } from '@/features/rooms/types';
import { useCreateRequestItem, useUpdateRequestItem } from '@/hooks/useRequestCategories';
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const SecurityManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('requests');
  const { data: allRequests, isLoading, refetch } = useServiceRequests();
  const { categories } = useRequestCategories();
  const securityCategory = useSecurityCategory();
  const createCategory = useCreateRequestCategory();

  const securityRequests = allRequests?.filter(
    request => request.category_id === securityCategory?.id
  ) || [];

  const pendingRequests = securityRequests.filter(req => req.status === 'pending');
  const inProgressRequests = securityRequests.filter(req => req.status === 'in_progress');
  const completedRequests = securityRequests.filter(req => req.status === 'completed');

  const handleStatusChange = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      // Call the updateRequestStatus function
      await updateRequestStatus(requestId, newStatus);
      
      toast({
        title: "Status Updated",
        description: `Request ${requestId} updated to ${getStatusLabel(newStatus)}`,
      });
      
      // Refetch data after successful update
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const RequestCard = ({ request }: { request: any }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold">
            Room {request.room_number || request.room_id}
          </CardTitle>
          <div className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status] || statusColors['pending']}`}>
            {getStatusLabel(request.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm">
          <span className="font-medium text-gray-700">Guest:</span> {request.guest_name || '-'}
        </div>
        <div className="mb-2 text-sm">
          <span className="font-medium text-gray-700">Request:</span>{' '}
          {request.request_items?.name || request.type}
        </div>
        <p className="text-sm mb-3">{request.description}</p>
        <div className="text-xs text-gray-500 mb-3">
          Created on {new Date(request.created_at).toLocaleString()}
        </div>
        <div className="flex gap-2">
          {request.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleStatusChange(request.id, 'in_progress')}
              >
                Start
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-500"
                onClick={() => handleStatusChange(request.id, 'cancelled')}
              >
                Cancel
              </Button>
            </>
          )}
          {request.status === 'in_progress' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleStatusChange(request.id, 'completed')}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-500"
                onClick={() => handleStatusChange(request.id, 'cancelled')}
              >
                Cancel
              </Button>
            </>
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

  const createSecurityCategory = async () => {
    try {
      const newCategory = await createCategory.mutateAsync({
        name: 'Security',
        description: 'Security related requests',
        is_active: true,
        icon: 'shield'
      });
      toast({
        title: "Success",
        description: "Security category created"
      });
      return newCategory;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create security category",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleAddItem = async () => {
    let targetCategoryId = securityCategory?.id;
    if (!targetCategoryId) {
      const newCategory = await createSecurityCategory();
      if (!newCategory) return;
      targetCategoryId = newCategory.id;
    }

    if (!newItem.name) {
      toast({
        title: "Validation",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createItem.mutateAsync({
        ...newItem,
        category_id: targetCategoryId
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
      toast({
        title: "Error",
        description: "Unable to add item",
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
        description: "Item updated"
      });
      setIsEditItemDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating item",
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
          <h1 className="text-2xl font-bold">Security Management</h1>
        </div>
        <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="requests">Security Requests</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading requests...</div>
            ) : securityRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <ShieldAlert className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-lg font-medium text-gray-900">No security requests</p>
                  <p className="text-sm text-gray-500 max-w-md text-center mt-1">
                    Security requests submitted by guests will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
                    Pending ({pendingRequests.length})
                  </h3>
                  {pendingRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
                    In Progress ({inProgressRequests.length})
                  </h3>
                  {inProgressRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-green-400 rounded-full"></span>
                    Completed ({completedRequests.length})
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
              createSecurityCategory={createSecurityCategory}
            />
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Configure security settings and add request items for the security category.
                </p>
                {securityCategory ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Security Category</h3>
                    <p className="text-sm">ID: {securityCategory.id}</p>
                    <p className="text-sm">Name: {securityCategory.name}</p>
                    <p className="text-sm">Description: {securityCategory.description || 'No description'}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p>No security category found.</p>
                    <Button 
                      className="mt-2" 
                      variant="outline" 
                      onClick={createSecurityCategory}
                      disabled={createCategory.isPending}
                    >
                      {createCategory.isPending ? "Creating..." : "Create Security Category"}
                    </Button>
                  </div>
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
