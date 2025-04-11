
import React from 'react';
import { DialogContent as BaseDialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import RequestCategoriesView from '@/features/services/components/dialog/RequestCategoriesView';
import RequestItemsView from '@/features/services/components/dialog/RequestItemsView';
import { RequestCategory } from '@/features/rooms/types';

interface RequestDialogContentProps {
  view: 'categories' | 'items';
  selectedCategory: RequestCategory | null;
  selectedItems: string[];
  isSubmitting: boolean;
  dialogTitle: string;
  dialogDescription: string;
  onSelectCategory: (category: RequestCategory) => void;
  onGoBackToCategories: () => void;
  onToggleRequestItem: (itemId: string) => void;
  onSubmitRequests: () => void;
  onDialogClose: () => void;
}

const RequestDialogContent = ({
  view,
  selectedCategory,
  selectedItems,
  isSubmitting,
  dialogTitle,
  dialogDescription,
  onSelectCategory,
  onGoBackToCategories,
  onToggleRequestItem,
  onSubmitRequests,
  onDialogClose
}: RequestDialogContentProps) => {
  return (
    <BaseDialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogDescription>{dialogDescription}</DialogDescription>
      </DialogHeader>
      
      <div className="py-4">
        {view === 'categories' && (
          <RequestCategoriesView 
            onSelectCategory={onSelectCategory}
          />
        )}
        
        {view === 'items' && selectedCategory && (
          <RequestItemsView
            category={selectedCategory}
            selectedItems={selectedItems}
            onToggleItem={onToggleRequestItem}
            onGoBackToCategories={onGoBackToCategories}
            onSubmitRequests={onSubmitRequests}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </BaseDialogContent>
  );
};

export default RequestDialogContent;
