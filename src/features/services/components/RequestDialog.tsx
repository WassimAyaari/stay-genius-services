
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useRequestDialog } from '@/features/services/hooks/useRequestDialog';
import { Room } from '@/hooks/useRoom';
import UserInfoDialog from '@/features/services/components/UserInfoDialog';
import RequestPresetView from '@/features/services/components/dialog/RequestPresetView';
import RequestCategoriesView from '@/features/services/components/dialog/RequestCategoriesView';
import RequestItemsView from '@/features/services/components/dialog/RequestItemsView';

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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {view === 'presets' && (
              <RequestPresetView 
                onSelectPreset={handlePresetRequest}
                onBrowseAllCategories={() => handleGoBackToCategories()}
              />
            )}
            
            {view === 'categories' && (
              <RequestCategoriesView 
                onSelectCategory={handleSelectCategory}
                onGoBackToPresets={handleGoBackToPresets}
              />
            )}
            
            {view === 'items' && selectedCategory && (
              <RequestItemsView
                category={selectedCategory}
                selectedItems={selectedItems}
                onToggleItem={handleToggleRequestItem}
                onGoBackToCategories={handleGoBackToCategories}
                onSubmitRequests={handleSubmitRequests}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
          
          <DialogFooter>
            {/* Footer content moved to the respective view components */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UserInfoDialog
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
