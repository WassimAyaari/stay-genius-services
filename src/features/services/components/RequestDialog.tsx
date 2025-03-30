
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useRequestDialog } from '@/features/services/hooks/useRequestDialog';
import { Room } from '@/hooks/useRoom';
import DialogContent from '@/features/services/components/dialog/DialogContent';
import UserInfoDialogWrapper from '@/features/services/components/dialog/UserInfoDialogWrapper';

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
    isUserInfoDialogOpen,
    userInfo,
    dialogTitle,
    dialogDescription,
    setIsUserInfoDialogOpen,
    setUserInfo,
    handleSelectCategory,
    handleGoBackToCategories,
    handleGoBackToPresets,
    handleToggleRequestItem,
    handlePresetRequest,
    handleSubmitRequests,
    saveUserInfo,
    handleDialogClose
  } = useRequestDialog(room, () => onOpenChange(false));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          handleDialogClose();
        }
        onOpenChange(open);
      }}>
        <DialogContent
          view={view}
          selectedCategory={selectedCategory}
          selectedItems={selectedItems}
          isSubmitting={isSubmitting}
          dialogTitle={dialogTitle}
          dialogDescription={dialogDescription}
          onSelectCategory={handleSelectCategory}
          onGoBackToCategories={handleGoBackToCategories}
          onGoBackToPresets={handleGoBackToPresets}
          onToggleRequestItem={handleToggleRequestItem}
          onPresetRequest={handlePresetRequest}
          onSubmitRequests={handleSubmitRequests}
          onDialogClose={handleDialogClose}
        />
      </Dialog>

      <UserInfoDialogWrapper
        isOpen={isUserInfoDialogOpen}
        onOpenChange={setIsUserInfoDialogOpen}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        onSubmit={() => saveUserInfo(userInfo)}
      />
    </>
  );
};

export default RequestDialog;
