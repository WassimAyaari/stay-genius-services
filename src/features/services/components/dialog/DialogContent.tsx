
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import RequestPresetView from '@/features/services/components/dialog/RequestPresetView';
import RequestCategoriesView from '@/features/services/components/dialog/RequestCategoriesView';
import RequestItemsView from '@/features/services/components/dialog/RequestItemsView';
import { RequestCategory } from '@/features/rooms/types';

interface DialogContentProps {
  view: 'presets' | 'categories' | 'items';
  selectedCategory: RequestCategory | null;
  selectedItems: string[];
  isSubmitting: boolean;
  dialogTitle: string;
  dialogDescription: string;
  onSelectCategory: (category: RequestCategory) => void;
  onGoBackToCategories: () => void;
  onGoBackToPresets: () => void;
  onToggleRequestItem: (itemId: string) => void;
  onPresetRequest: (preset: {category: string, description: string, type: string}) => void;
  onSubmitRequests: () => void;
  onDialogClose: () => void;
}

const DialogContent = ({
  view,
  selectedCategory,
  selectedItems,
  isSubmitting,
  dialogTitle,
  dialogDescription,
  onSelectCategory,
  onGoBackToCategories,
  onGoBackToPresets,
  onToggleRequestItem,
  onPresetRequest,
  onSubmitRequests,
  onDialogClose
}: DialogContentProps) => {
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogDescription>{dialogDescription}</DialogDescription>
      </DialogHeader>
      
      <div className="py-4">
        {view === 'presets' && (
          <RequestPresetView 
            onSelectPreset={onPresetRequest}
            onBrowseAllCategories={onGoBackToCategories}
          />
        )}
        
        {view === 'categories' && (
          <RequestCategoriesView 
            onSelectCategory={onSelectCategory}
            onGoBackToPresets={onGoBackToPresets}
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
    </DialogContent>
  );
};

export default DialogContent;
