
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader, Check } from 'lucide-react';
import RequestItemList from '@/features/services/components/RequestItemList';
import { RequestCategory } from './DialogContent';

interface RequestItemsViewProps {
  category: RequestCategory;
  selectedItems: string[];
  onToggleItem: (itemId: string) => void;
  onGoBackToCategories: () => void;
  onSubmitRequests: () => void;
  isSubmitting: boolean;
}

const RequestItemsView = ({ 
  category, 
  selectedItems, 
  onToggleItem, 
  onGoBackToCategories,
  onSubmitRequests,
  isSubmitting
}: RequestItemsViewProps) => {
  return (
    <div>
      <RequestItemList 
        category={category} 
        onGoBack={onGoBackToCategories} 
        selectedItems={selectedItems} 
        onToggleItem={onToggleItem} 
      />
      <div className="flex w-full justify-between items-center mt-4">
        <div className="text-sm">
          {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
        </div>
        <Button 
          onClick={onSubmitRequests} 
          disabled={selectedItems.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Submit Requests
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RequestItemsView;
