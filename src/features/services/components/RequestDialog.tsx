
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useRequestDialog } from '@/features/services/hooks/useRequestDialog';
import { Room } from '@/hooks/useRoom';
import RequestDialogContent from '@/features/services/components/dialog/DialogContent';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  room: Room | null;
}

const RequestDialog = ({ isOpen, onOpenChange, room }: RequestDialogProps) => {
  const {
    view,
    selectedCategory,
    selectedItems,
    isSubmitting,
    userInfo,
    dialogTitle,
    dialogDescription,
    handleSelectCategory,
    handleGoBackToCategories,
    handleToggleRequestItem,
    handleSubmitRequests,
    handleDialogClose
  } = useRequestDialog(room, () => onOpenChange(false));

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
