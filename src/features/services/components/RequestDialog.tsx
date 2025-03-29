
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader, Check } from 'lucide-react';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import RequestCategoryList from '@/features/services/components/RequestCategoryList';
import RequestItemList from '@/features/services/components/RequestItemList';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';
import { v4 as uuidv4 } from 'uuid';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  room: Room | null;
}

const RequestDialog = ({ isOpen, onOpenChange, room }: RequestDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedItemsData, setSelectedItemsData] = useState<Map<string, string>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset selected items when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedCategory(null);
      setSelectedItems([]);
      setSelectedItemsData(new Map());
    }
  }, [isOpen]);

  const handleSelectCategory = (category: RequestCategory) => {
    setSelectedCategory(category);
    setSelectedItems([]);
    setSelectedItemsData(new Map());
  };

  const handleGoBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItems([]);
    setSelectedItemsData(new Map());
  };

  const handleToggleRequestItem = (itemId: string) => {
    console.log(`Toggle item called with ID: ${itemId}`);
    
    setSelectedItems(prev => {
      // Copy the previous array to avoid mutation issues
      const isAlreadySelected = prev.includes(itemId);
      
      // Create a new array based on the selection state
      if (isAlreadySelected) {
        const result = prev.filter(id => id !== itemId);
        console.log(`Item was already selected, removing it. New selectedItems: ${result.join(', ')}`);
        return result;
      } else {
        const result = [...prev, itemId];
        console.log(`Item was not selected, adding it. New selectedItems: ${result.join(', ')}`);
        return result;
      }
    });
  };

  const handleSubmitRequests = async () => {
    // Make sure we log the most up-to-date state
    console.log("Selected items during submission:", selectedItems);
    
    if (!selectedItems.length || !room) {
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
        console.log(`Submitting request for item with ID: ${itemId}`);
        
        await requestService(
          room.id, 
          selectedCategory?.name.toLowerCase() as any || 'custom', 
          selectedCategory?.name || 'Custom Request', 
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
      setSelectedItemsData(new Map());
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
              onToggleItem={handleToggleRequestItem} 
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
