
import React from 'react';
import { RequestCategory } from '@/features/rooms/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, Edit, Plus } from 'lucide-react';

interface CategoryListProps {
  categories: RequestCategory[] | undefined;
  isLoading: boolean;
  onEditCategory: (category: RequestCategory) => void;
  onAddItem: (category: RequestCategory) => void;
}

export const CategoryList = ({ 
  categories, 
  isLoading, 
  onEditCategory, 
  onAddItem 
}: CategoryListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
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
                  onClick={() => onEditCategory(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onAddItem(category)}
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
  );
};
