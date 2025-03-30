
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash, 
  Check, 
  X, 
  Loader,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { 
  useRequestCategories, 
  useRequestItems, 
  useCreateRequestCategory,
  useUpdateRequestCategory,
  useCreateRequestItem,
  useUpdateRequestItem
} from '@/hooks/useRequestCategories';
import { RequestCategory, RequestItem, ServiceRequest } from '@/features/rooms/types';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { updateRequestStatus } from '@/features/rooms/controllers/roomService';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServiceRequestWithItem extends ServiceRequest {
  request_items?: RequestItem | null;
}

const RequestManager = () => {
  const { toast } = useToast();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '' });
  const [itemForm, setItemForm] = useState({ name: '', description: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { data: categories, isLoading: isLoadingCategories } = useRequestCategories();
  const { 
    data: requests, 
    isLoading: isLoadingRequests,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['service-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const serviceRequests = data as ServiceRequest[];
      const requestsWithItems: ServiceRequestWithItem[] = [];
      
      for (const request of serviceRequests) {
        if (request.request_item_id) {
          const { data: itemData } = await supabase
            .from('request_items')
            .select('*')
            .eq('id', request.request_item_id)
            .single();
            
          requestsWithItems.push({
            ...request,
            request_items: itemData as unknown as RequestItem
          });
        } else {
          requestsWithItems.push({
            ...request,
            request_items: null
          });
        }
      }
      
      return requestsWithItems;
    },
  });
  
  const createCategoryMutation = useCreateRequestCategory();
  const updateCategoryMutation = useUpdateRequestCategory();
  const createItemMutation = useCreateRequestItem();
  const updateItemMutation = useUpdateRequestItem();
  
  const handleOpenCategoryDialog = (category?: RequestCategory) => {
    if (category) {
      setCategoryForm({
        name: category.name,
        description: category.description || '',
        icon: category.icon || ''
      });
      setIsUpdating(true);
      setSelectedCategory(category);
    } else {
      setCategoryForm({ name: '', description: '', icon: '' });
      setIsUpdating(false);
      setSelectedCategory(null);
    }
    setCategoryDialogOpen(true);
  };
  
  const handleSubmitCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (isUpdating && selectedCategory) {
        await updateCategoryMutation.mutateAsync({
          id: selectedCategory.id,
          name: categoryForm.name,
          description: categoryForm.description,
          icon: categoryForm.icon
        });
        toast({
          title: "Success",
          description: "Category updated successfully"
        });
      } else {
        await createCategoryMutation.mutateAsync({
          name: categoryForm.name,
          description: categoryForm.description,
          icon: categoryForm.icon,
          is_active: true
        });
        toast({
          title: "Success",
          description: "Category created successfully"
        });
      }
      setCategoryDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive"
      });
    }
  };
  
  const handleOpenItemDialog = (category: RequestCategory, item?: RequestItem) => {
    setSelectedCategory(category);
    if (item) {
      setItemForm({
        name: item.name,
        description: item.description || ''
      });
      setIsUpdating(true);
    } else {
      setItemForm({ name: '', description: '' });
      setIsUpdating(false);
    }
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
  
  const handleUpdateRequestStatus = async (requestId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await updateRequestStatus(requestId, newStatus);
      toast({
        title: "Status Updated",
        description: `Request status changed to ${newStatus}`
      });
      refetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="flex items-center"><Loader className="mr-1 h-3 w-3" /> In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500 flex items-center"><CheckCircle2 className="mr-1 h-3 w-3" /> Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center"><X className="mr-1 h-3 w-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Request Status Management</h2>
          </div>
          
          {isLoadingRequests ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests && requests.length > 0 ? (
                      requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.room_number || request.room_id}</TableCell>
                          <TableCell>{request.guest_name || 'Unknown'}</TableCell>
                          <TableCell className="capitalize">{request.type.replace('_', ' ')}</TableCell>
                          <TableCell>
                            {request.request_items ? (
                              <span>{request.request_items.name}</span>
                            ) : (
                              <span>{request.description || '-'}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(request.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Update Status <ChevronDown className="ml-1 h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdateRequestStatus(request.id, 'pending')}
                                    disabled={request.status === 'pending'}
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Mark as Pending
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdateRequestStatus(request.id, 'in_progress')}
                                    disabled={request.status === 'in_progress'}
                                  >
                                    <Loader className="mr-2 h-4 w-4" />
                                    Mark as In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdateRequestStatus(request.id, 'completed')}
                                    disabled={request.status === 'completed'}
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdateRequestStatus(request.id, 'cancelled')}
                                    disabled={request.status === 'cancelled'}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Mark as Cancelled
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No requests found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Request Categories</h2>
            <Button onClick={() => handleOpenCategoryDialog()}>
              <Plus className="mr-1 h-4 w-4" />
              Add Category
            </Button>
          </div>
          
          {isLoadingCategories ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <Card key={category.id} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {category.icon && <span className="text-xl">{category.icon}</span>}
                          <h3 className="text-lg font-medium">{category.name}</h3>
                        </div>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenCategoryDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenItemDialog(category)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 text-muted-foreground">
                  No categories found. Create your first category to get started.
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="items">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Request Items by Category</h2>
          </div>
          
          {isLoadingCategories ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : categories && categories.length > 0 ? (
            categories.map((category) => (
              <CategoryItemsList 
                key={category.id} 
                category={category}
                onAddItem={() => handleOpenItemDialog(category)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No categories found. Create categories first.
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isUpdating ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input 
                id="name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                placeholder="e.g. Housekeeping, Maintenance"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input 
                id="icon"
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                placeholder="e.g. 🧹, 🛠️"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                placeholder="Brief description of this category"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmitCategory}
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
            >
              {(createCategoryMutation.isPending || updateCategoryMutation.isPending) ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isUpdating ? 'Edit Item' : 'Add Item to Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              <p className="bg-muted p-2 rounded-md">
                {selectedCategory?.name}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input 
                id="itemName"
                value={itemForm.name}
                onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                placeholder="e.g. Extra pillows, Clean bathroom"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="itemDescription">Description (Optional)</Label>
              <Textarea 
                id="itemDescription"
                value={itemForm.description}
                onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                placeholder="Additional details about this request item"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmitItem}
              disabled={createItemMutation.isPending || updateItemMutation.isPending}
            >
              {(createItemMutation.isPending || updateItemMutation.isPending) ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Item'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CategoryItemsList = ({ 
  category,
  onAddItem
}: { 
  category: RequestCategory,
  onAddItem: () => void
}) => {
  const { data: items, isLoading } = useRequestItems(category.id);
  
  return (
    <Card className="mb-4">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {category.icon && <span className="text-xl">{category.icon}</span>}
            <h3 className="font-medium">{category.name}</h3>
          </div>
          <Button size="sm" variant="outline" onClick={onAddItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>
      </div>
      <div className="p-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items && items.length > 0 ? (
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="py-2 px-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No items found for this category
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestManager;
