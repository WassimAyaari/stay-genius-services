
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { PlusCircle, Trash2, Edit, Pencil, Save, Search } from 'lucide-react';
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
import { useRequestCategories, useCreateRequestItem, useUpdateRequestItem } from '@/hooks/useRequestCategories';
import { RequestItem } from '@/features/rooms/types';

const MaintenanceManager = () => {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
  
  // Find the Maintenance and Technical categories
  const maintenanceCategory = categories.find(cat => cat.name === 'Maintenance');
  const technicalCategory = categories.find(cat => cat.name === 'Technical');
  
  // Get the IDs of both categories
  const categoryIds = [
    maintenanceCategory?.id,
    technicalCategory?.id
  ].filter(Boolean) as string[];
  
  // Filter items by the Maintenance or Technical categories
  const maintenanceItems = allItems.filter(
    item => categoryIds.includes(item.category_id) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddItem = async () => {
    if (categoryIds.length === 0) {
      toast({
        title: "Error",
        description: "Maintenance or Technical category not found",
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
    
    if (!newItem.category_id) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createItem.mutateAsync({
        ...newItem
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
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Maintenance & Technical Items Management</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Maintenance & Technical Service Items</CardTitle>
              <Button 
                onClick={() => setIsAddItemDialogOpen(true)}
                disabled={categoryIds.length === 0}
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
            ) : maintenanceItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{getCategoryName(item.category_id)}</TableCell>
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
                {categoryIds.length === 0
                  ? "Maintenance or Technical categories not found. Please create them first." 
                  : "No maintenance or technical items found."}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Add Item Dialog */}
        <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Maintenance/Technical Item</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select 
                  id="category"
                  value={newItem.category_id}
                  onChange={(e) => setNewItem({...newItem, category_id: e.target.value})}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Select Category</option>
                  {maintenanceCategory && (
                    <option value={maintenanceCategory.id}>Maintenance</option>
                  )}
                  {technicalCategory && (
                    <option value={technicalCategory.id}>Technical</option>
                  )}
                </select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Air Conditioning Issue"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Report a problem with the room's air conditioning"
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
              <DialogTitle>Edit Maintenance/Technical Item</DialogTitle>
            </DialogHeader>
            
            {editingItem && (
              <div className="space-y-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
                  <select 
                    id="edit-category"
                    value={editingItem.category_id}
                    onChange={(e) => setEditingItem({...editingItem, category_id: e.target.value})}
                    className="px-3 py-2 border rounded-md"
                  >
                    {maintenanceCategory && (
                      <option value={maintenanceCategory.id}>Maintenance</option>
                    )}
                    {technicalCategory && (
                      <option value={technicalCategory.id}>Technical</option>
                    )}
                  </select>
                </div>
                
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

export default MaintenanceManager;
