import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { PlusCircle, Trash2, Edit, Pencil, Save, Search, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { useRequestCategories, useCreateRequestItem, useUpdateRequestItem } from '@/hooks/useRequestCategories';
import { RequestItem } from '@/features/rooms/types';
import { useRequestsData } from '@/hooks/useRequestsData';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';

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
  const { categories, allItems, isLoading } = useRequestCategories();
  const createItem = useCreateRequestItem();
  const updateItem = useUpdateRequestItem();
  const { requests, isLoading: isRequestsLoading, handleRefresh } = useRequestsData();
  const { cancelRequest, isCancelling } = useServiceRequests();
  
  // Find the Housekeeping category
  const housekeepingCategory = categories.find(cat => cat.name === 'Housekeeping');
  
  // Filter items by the Housekeeping category
  const housekeepingItems = allItems.filter(
    item => item.category_id === (housekeepingCategory?.id || '') &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter housekeeping requests
  const housekeepingRequests = requests.filter(
    req => {
      // Check if the request is related to housekeeping
      const isHousekeeping = 
        req.category_id === housekeepingCategory?.id || 
        req.type?.toLowerCase() === 'housekeeping' ||
        (req.request_items && req.request_items.category_id === housekeepingCategory?.id);
      
      // Apply search filter
      const matchesSearch = 
        !requestsSearchTerm || 
        req.description?.toLowerCase().includes(requestsSearchTerm.toLowerCase()) ||
        req.guest_name?.toLowerCase().includes(requestsSearchTerm.toLowerCase()) ||
        req.room_number?.toLowerCase().includes(requestsSearchTerm.toLowerCase()) ||
        (req.request_items && req.request_items.name.toLowerCase().includes(requestsSearchTerm.toLowerCase()));
      
      return isHousekeeping && matchesSearch;
    }
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
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
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Housekeeping Service Items</CardTitle>
                  <Button 
                    onClick={() => setIsAddItemDialogOpen(true)}
                    disabled={!housekeepingCategory}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : housekeepingItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {housekeepingItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.description || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {item.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {!housekeepingCategory 
                      ? "Housekeeping category not found. Please create it first." 
                      : "No housekeeping items found."}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Housekeeping Requests</CardTitle>
                  <Button 
                    onClick={handleRefresh}
                    variant="outline"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={requestsSearchTerm}
                      onChange={(e) => setRequestsSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {isRequestsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : housekeepingRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Request</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {housekeepingRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.room_number || '-'}</TableCell>
                          <TableCell>{request.guest_name || '-'}</TableCell>
                          <TableCell>
                            {request.request_items?.name || request.type}
                            {request.description && (
                              <p className="text-xs text-muted-foreground mt-1">{request.description}</p>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(request.status)}`}>
                              {request.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {request.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpdateRequestStatus(request.id, 'in_progress')}
                                >
                                  Start
                                </Button>
                              )}
                              
                              {request.status === 'in_progress' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpdateRequestStatus(request.id, 'completed')}
                                >
                                  Complete
                                </Button>
                              )}
                              
                              {(request.status === 'pending' || request.status === 'in_progress') && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleUpdateRequestStatus(request.id, 'cancelled')}
                                  className="text-red-500"
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No housekeeping requests found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Add Item Dialog */}
        <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Housekeeping Item</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Extra Towels"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Request additional towels for your room"
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddItem} disabled={createItem.isPending}>
                {createItem.isPending ? 'Adding...' : 'Add Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Item Dialog */}
        <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Housekeeping Item</DialogTitle>
            </DialogHeader>
            
            {editingItem && (
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">Name</label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                  <Input
                    id="edit-description"
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editingItem.is_active}
                    onChange={(e) => setEditingItem({...editingItem, is_active: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateItem} disabled={updateItem.isPending}>
                {updateItem.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default HousekeepingManager;
