
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader, Check, ChevronLeft } from 'lucide-react';
import { RequestCategory, RequestItem } from '@/features/rooms/types';
import RequestCategoryList from '@/features/services/components/RequestCategoryList';
import RequestItemList from '@/features/services/components/RequestItemList';
import RequestPresetList from '@/features/services/components/RequestPresetList';
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
  const [view, setView] = useState<'categories' | 'items' | 'presets'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Fetch items for the selected category to have access to their names
  const { data: categoryItems } = useRequestItems(selectedCategory?.id);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setView('presets');
      setSelectedCategory(null);
      setSelectedItems([]);
    }
  }, [isOpen]);

  const handleSelectCategory = (category: RequestCategory) => {
    setSelectedCategory(category);
    setSelectedItems([]);
    setView('items');
  };

  const handleGoBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedItems([]);
    setView('categories');
  };

  const handleGoBackToPresets = () => {
    setSelectedCategory(null);
    setSelectedItems([]);
    setView('presets');
  };

  const handleToggleRequestItem = (itemId: string) => {
    setSelectedItems(prevItems => {
      // Check if the item is already selected
      const isAlreadySelected = prevItems.includes(itemId);
      
      // Create a new array based on the selection state
      if (isAlreadySelected) {
        return prevItems.filter(id => id !== itemId);
      } else {
        return [...prevItems, itemId];
      }
    });
  };

  const handlePresetRequest = async (preset: {category: string, description: string, type: string}) => {
    if (!room) {
      toast({
        title: "Room information missing",
        description: "Unable to submit request without room information.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const userInfo = getUserInfo();
      
      await requestService(
        room.id,
        preset.type as any,
        preset.description,
        undefined,
        undefined,
        userInfo.name,
        userInfo.roomNumber || room.room_number
      );
      
      toast({
        title: "Request Submitted",
        description: "Your request has been sent successfully."
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleSubmitRequests = async () => {
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
      const userInfo = getUserInfo();
      
      // Submit each selected item
      for (const itemId of selectedItems) {
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
          userInfo.name, 
          userInfo.roomNumber || room.room_number
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

  const getDialogTitle = () => {
    if (view === 'presets') return "Common Requests";
    if (view === 'categories') return "Select Request Category";
    if (selectedCategory) return `Select ${selectedCategory.name} Requests`;
    return "Select Request";
  };

  const getDialogDescription = () => {
    if (view === 'presets') return "Choose from common requests or browse all categories";
    if (view === 'categories') return "Choose a category to see available requests";
    if (selectedCategory) return "Select the items you'd like to request";
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {view === 'presets' && (
            <div>
              <RequestPresetList onSelectPreset={handlePresetRequest} onBrowseAll={() => setView('categories')} />
            </div>
          )}
          
          {view === 'categories' && (
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4"
                onClick={handleGoBackToPresets}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Common Requests
              </Button>
              <RequestCategoryList onSelectCategory={handleSelectCategory} />
            </div>
          )}
          
          {view === 'items' && selectedCategory && (
            <RequestItemList 
              category={selectedCategory} 
              onGoBack={handleGoBackToCategories} 
              selectedItems={selectedItems} 
              onToggleItem={handleToggleRequestItem} 
            />
          )}
        </div>
        
        <DialogFooter>
          {view === 'items' && selectedCategory && (
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
