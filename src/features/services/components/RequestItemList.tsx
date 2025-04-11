
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, ChevronLeft } from 'lucide-react';
import { RequestCategory } from '../components/dialog/DialogContent';
import { Checkbox } from '@/components/ui/checkbox';

interface RequestItemListProps {
  category: RequestCategory;
  onGoBack: () => void;
  selectedItems: string[];
  onToggleItem: (itemId: string) => void;
}

const RequestItemList = ({ 
  category, 
  onGoBack, 
  selectedItems,
  onToggleItem
}: RequestItemListProps) => {
  // Define static items based on category
  const getCategoryItems = (categoryId: string) => {
    switch (categoryId) {
      case 'housekeeping':
        return [
          { id: 'fresh-towels', name: 'Fresh Towels', description: 'Request clean towels for your room' },
          { id: 'room-cleaning', name: 'Room Cleaning', description: 'Request a full room cleaning service' },
          { id: 'bed-making', name: 'Bed Making', description: 'Request your bed to be made' },
          { id: 'toiletries', name: 'Toiletries', description: 'Request additional toiletries' },
        ];
      case 'maintenance':
        return [
          { id: 'ac-issue', name: 'AC Issue', description: 'Problems with air conditioning' },
          { id: 'tv-issue', name: 'TV Issue', description: 'Problems with television' },
          { id: 'plumbing', name: 'Plumbing Issue', description: 'Issues with plumbing or water' },
          { id: 'electrical', name: 'Electrical Issue', description: 'Problems with electrical outlets or lighting' },
          { id: 'furniture', name: 'Furniture Issue', description: 'Problems with room furniture' },
        ];
      case 'reception':
        return [
          { id: 'check-out', name: 'Check-out Assistance', description: 'Help with checking out' },
          { id: 'luggage', name: 'Luggage Assistance', description: 'Help with luggage storage or transport' },
          { id: 'information', name: 'Information', description: 'General hotel information' },
          { id: 'key-card', name: 'Key Card Issue', description: 'Problems with your room key card' },
        ];
      default:
        return [];
    }
  };

  const items = getCategoryItems(category.id);

  // Helper function to check if an item is selected
  const isItemSelected = (itemId: string) => {
    return selectedItems.includes(itemId);
  };

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

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No items available in this category</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const checked = isItemSelected(item.id);
            
            return (
              <Card 
                key={item.id}
                className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onToggleItem(item.id)}
              >
                <div className="flex items-center">
                  <Checkbox 
                    id={`item-${item.id}`}
                    checked={checked}
                    onCheckedChange={() => onToggleItem(item.id)}
                    className="mr-3"
                  />
                  <label 
                    htmlFor={`item-${item.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </label>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestItemList;
