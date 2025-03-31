
import React from 'react';
import { useRequestCategories } from '@/hooks/useRequestCategories';
import { Loader } from 'lucide-react';
import { CategoryItemsList } from '@/components/admin/requests/CategoryItemsList';

interface ItemsTabProps {
  onAddItem: (category: any) => void;
}

export const ItemsTab = ({ onAddItem }: ItemsTabProps) => {
  const { categories, isLoading: isLoadingCategories } = useRequestCategories();
  
  return (
    <>
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
            onAddItem={() => onAddItem(category)}
          />
        ))
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No categories found. Create categories first.
        </div>
      )}
    </>
  );
};
