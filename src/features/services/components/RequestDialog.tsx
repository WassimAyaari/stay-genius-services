
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader, Check } from 'lucide-react';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import RequestCategoryList from '@/features/services/components/RequestCategoryList';
import RequestItemList from '@/features/services/components/RequestItemList';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';
import { v4 as uuidv4 } from 'uuid';
import { useRequestItems } from '@/hooks/useRequestCategories';

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
  
  // Fetch items for the selected category to have access to their names
  const { data: categoryItems } = useRequestItems(selectedCategory?.id);

  // Reset selected items when dialog opens/closes or category changes
  useEffect(() => {
    if (!isOpen || !selectedCategory) {
      setSelectedItems([]);
    }
  }, [isOpen, selectedCategory]);

  const handleSelectCategory = (category: RequestCategory) => {
    setSelectedCategory(category);
    setSelectedItems([]);
  };

  const handleGoBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItems([]);
  };

  const handleToggleRequestItem = (itemId: string) => {
    console.log(`Toggle item called with ID: ${itemId}`);
    
    setSelectedItems(prev => {
      // Check if the item is already selected
      const isAlreadySelected = prev.includes(itemId);
      
      // Create a new array based on the selection state
      if (isAlreadySelected) {
        const result = prev.filter(id => id !== itemId);
        console.log(`Item was already selected, removing it. New selectedItems:`, result);
        return result;
      } else {
        const result = [...prev, itemId];
        console.log(`Item was not selected, adding it. New selectedItems:`, result);
        return result;
      }
    });
  };

  const handleSubmitRequests = async () => {
    // Log the most up-to-date state to debug
    console.log("Selected items during submission:", selectedItems);
    
    if (selectedItems.length === 0 || !room) {
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
      
      // Submit each selected item
      for (const itemId of selectedItems) {
        console.log(`Submitting request for item with ID: ${itemId}`);
        
        // Find the item name for better description
        const itemName = categoryItems?.find(item => item.id === itemId)?.name || 'Unknown Item';
        const categoryName = selectedCategory?.name || 'Custom Request';
        const description = `${categoryName} - ${itemName}`;
        
        await requestService(
          room.id, 
          selectedCategory?.name.toLowerCase() as any || 'custom', 
          description, 
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
      
      // Clear selections and close dialog after successful submission
      setSelectedItems([]);
      setSelectedCategory(null);
      onOpenChange(false);
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
          <DialogDescription>
            {selectedCategory 
              ? "Select the items you'd like to request" 
              : "Choose a category to see available requests"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {selectedCategory ? (
            <RequestItemList 
              category={selectedCategory} 
              onGoBack={handleGoBackToCategories} 
              onSelectItem={(item) => {}} 
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
