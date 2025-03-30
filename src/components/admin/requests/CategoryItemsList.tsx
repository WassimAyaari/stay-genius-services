
import React from 'react';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRequestItems } from '@/hooks/useRequestCategories';
import { Edit, Trash, Loader, Plus } from 'lucide-react';

interface CategoryItemsListProps {
  category: RequestCategory;
  onAddItem: () => void;
}

export const CategoryItemsList = ({ 
  category,
  onAddItem
}: CategoryItemsListProps) => {
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
