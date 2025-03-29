
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, ChevronLeft } from 'lucide-react';
import { useRequestItems } from '@/hooks/useRequestCategories';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import { Checkbox } from '@/components/ui/checkbox';

interface RequestItemListProps {
  category: RequestCategory;
  onGoBack: () => void;
  onSelectItem: (item: RequestItem) => void;
  selectedItems: string[];
  onToggleItem: (itemId: string) => void;
}

const RequestItemList = ({ 
  category, 
  onGoBack, 
  onSelectItem, 
  selectedItems,
  onToggleItem
}: RequestItemListProps) => {
  const { data: items, isLoading } = useRequestItems(category.id);

  // Helper function to check if an item is selected
  const isItemSelected = (itemId: string) => {
    return selectedItems.includes(itemId);
  };

  // Debug to check what's happening with selected items
  console.log("Current selectedItems in RequestItemList:", selectedItems);

  return (
    <div>
      <div className="mb-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={onGoBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h3 className="text-lg font-medium">{category.name}</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No items available in this category</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Card 
              key={item.id}
              className="p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center">
                <Checkbox 
                  id={`item-${item.id}`}
                  checked={isItemSelected(item.id)}
                  onCheckedChange={() => {
                    console.log(`Checkbox toggled for item ID: ${item.id}, Name: ${item.name}`);
                    onToggleItem(item.id);
                  }}
                  className="mr-3"
                />
                <label 
                  htmlFor={`item-${item.id}`}
                  className="flex-1 cursor-pointer"
                  onClick={(e) => {
                    // Prevent default to avoid double toggling from the checkbox change
                    e.preventDefault();
                    console.log(`Label clicked for item ID: ${item.id}, Name: ${item.name}`);
                    onToggleItem(item.id);
                  }}
                >
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </label>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestItemList;
