
import React from 'react';
import { DialogContent as BaseDialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import RequestCategoriesView from '@/features/services/components/dialog/RequestCategoriesView';
import RequestItemsView from '@/features/services/components/dialog/RequestItemsView';

// Define the RequestCategory type in this file to ensure compatibility
export interface RequestCategory {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  parent_id?: string;
}

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
