
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useRequestCategories,
  useCreateRequestCategory,
  useUpdateRequestCategory
} from '@/hooks/useRequestCategories';
import { RequestCategory } from '@/features/rooms/types';
import { CategoryList } from '@/components/admin/requests/CategoryList';
import { CategoryForm } from '@/components/admin/requests/CategoryForm';

export const CategoriesTab = () => {
  const { toast } = useToast();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { categories, isLoading: isLoadingCategories } = useRequestCategories();
  const createCategoryMutation = useCreateRequestCategory();
  const updateCategoryMutation = useUpdateRequestCategory();
  
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
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Request Categories</h2>
        <Button onClick={() => handleOpenCategoryDialog()}>
          <Plus className="mr-1 h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      <CategoryList 
        categories={categories}
        isLoading={isLoadingCategories}
        onEditCategory={(category) => handleOpenCategoryDialog(category)}
        onAddItem={(category) => {/* This will be implemented in the parent component */}}
      />
      
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isUpdating ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm 
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            onSubmit={handleSubmitCategory}
            isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
