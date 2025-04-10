
import React, { useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useRequestDialog } from '@/features/services/hooks/useRequestDialog';
import { Room } from '@/hooks/useRoom';
import RequestDialogContent from '@/features/services/components/dialog/DialogContent';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  room: Room | null;
  initialCategory?: string | null;
}

const RequestDialog = ({ 
  isOpen, 
  onOpenChange, 
  room, 
  initialCategory 
}: RequestDialogProps) => {
  const {
    view,
    selectedCategory,
    selectedItems,
    isSubmitting,
    dialogTitle,
    dialogDescription,
    handleSelectCategory,
    handleGoBackToCategories,
    handleToggleRequestItem,
    handleSubmitRequests,
    handleDialogClose,
    setInitialCategory
  } = useRequestDialog(room, () => onOpenChange(false));

  // Set initial category if provided
  useEffect(() => {
    if (initialCategory && isOpen) {
      setInitialCategory(initialCategory);
    }
  }, [initialCategory, isOpen, setInitialCategory]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleDialogClose();
      }
      onOpenChange(open);
    }}>
      <RequestDialogContent
        view={view}
        selectedCategory={selectedCategory}
        selectedItems={selectedItems}
        isSubmitting={isSubmitting}
        dialogTitle={dialogTitle}
        dialogDescription={dialogDescription}
        onSelectCategory={handleSelectCategory}
        onGoBackToCategories={handleGoBackToCategories}
        onToggleRequestItem={handleToggleRequestItem}
        onSubmitRequests={handleSubmitRequests}
        onDialogClose={handleDialogClose}
      />
    </Dialog>
  );
};

export default RequestDialog;
