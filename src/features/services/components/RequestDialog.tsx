
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader, Check } from 'lucide-react';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import RequestCategoryList from '@/features/services/components/RequestCategoryList';
import RequestItemList from '@/features/services/components/RequestItemList';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  room: Room | null;
}

const RequestDialog = ({ isOpen, onOpenChange, room }: RequestDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSelectCategory = (category: RequestCategory) => {
    setSelectedCategory(category);
    setSelectedItems([]);
  };

  const handleGoBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItems([]);
  };

  const handleToggleRequestItem = (itemId: string) => {
    console.log(`Toggle item called with: ${itemId}`);
    console.log(`Current selectedItems: ${selectedItems.join(', ')}`);
    
    setSelectedItems(prev => {
      const isAlreadySelected = prev.includes(itemId);
      const newItems = isAlreadySelected 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId];
        
      console.log(`After toggle, selectedItems will be: ${newItems.join(', ')}`);
      return newItems;
    });
  };

  const handleSubmitRequests = async () => {
    if (!selectedItems.length || !room) {
      console.log("Selected items during submission:", selectedItems);
      toast({
        title: "No items selected",
        description: "Please select at least one request item",
        variant: "destructive"
      });
      return;
    }
    try {
      setIsSubmitting(true);
      const getUserInfo = () => {
        const userInfoStr = localStorage.getItem('user_data');
        if (userInfoStr) {
          try {
            return JSON.parse(userInfoStr);
          } catch (error) {
            console.error("Error parsing user info:", error);
          }
        }
        return {
          name: '',
          roomNumber: room?.room_number || ''
        };
      };
      
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('user_id', userId);
      }
      
      const currentUserInfo = getUserInfo();
      
      for (const itemId of selectedItems) {
        console.log(`Submitting request for item: ${itemId}`);
        const selectedItem = selectedCategory?.name ? 
          `${selectedCategory.name} - ${itemId}` : 
          itemId;
        
        await requestService(
          room.id, 
          selectedCategory?.name.toLowerCase() as any || 'custom', 
          selectedItem, 
          itemId, 
          selectedCategory?.id, 
          currentUserInfo.name, 
          currentUserInfo.roomNumber || room.room_number
        );
      }
      
      toast({
        title: "Requests Submitted",
        description: `${selectedItems.length} request(s) have been sent successfully.`
      });
      onOpenChange(false);
      setSelectedCategory(null);
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit requests. Please try again.",
        variant: "destructive"
      });
      console.error("Error submitting requests:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedCategory ? `Select ${selectedCategory.name} Requests` : "Select Request Category"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {selectedCategory ? (
            <RequestItemList 
              category={selectedCategory} 
              onGoBack={handleGoBackToCategories} 
              onSelectItem={() => {}} 
              selectedItems={selectedItems} 
              onToggleItem={(itemId) => {
                console.log(`Toggle item called with: ${itemId}`);
                console.log(`Current selectedItems: ${selectedItems.join(', ')}`);
                handleToggleRequestItem(itemId);
                console.log(`After toggle, selectedItems: ${selectedItems.includes(itemId) ? 'contains' : 'does not contain'} ${itemId}`);
              }} 
            />
          ) : (
            <RequestCategoryList onSelectCategory={handleSelectCategory} />
          )}
        </div>
        
        <DialogFooter>
          {selectedCategory && (
            <div className="flex w-full justify-between items-center">
              <div className="text-sm">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </div>
              <Button 
                onClick={handleSubmitRequests} 
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
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
