import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { 
  Command, 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { requestService } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/hooks/useRoom';
import { useRequestCategories } from '@/hooks/useRequestCategories';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

interface CommandSearchProps {
  room: Room | null;
  onRequestSuccess: () => void;
}

const CommandSearch = ({ room, onRequestSuccess }: CommandSearchProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { categories, allItems, isLoading } = useRequestCategories();
  const { userData } = useAuth();
  
  const itemsByCategory = useMemo(() => {
    return allItems.reduce((acc, item) => {
      if (!item.is_active) return acc;
      
      const categoryId = item.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(item);
      return acc;
    }, {} as Record<string, typeof allItems>);
  }, [allItems]);

  const securityCategory = categories.find(
    (cat) => cat.name?.toLowerCase().includes('secur') || cat.name?.toLowerCase().includes('sécurité') || cat.name?.toLowerCase().includes('security')
  );

  const handleSelect = async (itemId: string, itemName: string, itemCategory: string, itemDescription?: string) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const roomInfo = room || { id: '' };
      let roomId = roomInfo.id;
      let roomNumber = room?.room_number || userData?.room_number || localStorage.getItem('user_room_number') || '';
      
      if (!roomId && !roomNumber) {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            if (userData.room_number) {
              roomNumber = userData.room_number;
              localStorage.setItem('user_room_number', roomNumber);
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
        
        if (!roomNumber) {
          toast({
            title: "Room Information Missing",
            description: "We couldn't find your room information. Please provide it in your profile settings.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        
        roomId = roomNumber;
      }
      
      if (roomNumber && !localStorage.getItem('user_room_number')) {
        localStorage.setItem('user_room_number', roomNumber);
      }
      
      if (!roomId && roomNumber) {
        roomId = roomNumber;
      }
      
      await requestService(
        roomId,
        'service',
        `${itemName} - ${itemDescription || ''}`,
        itemId,
        itemCategory
      );
      
      toast({
        title: "Request Submitted",
        description: `Your request for ${itemName} has been submitted successfully.`,
      });
      
      onRequestSuccess();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className="relative flex items-center border rounded-lg px-4 py-3 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5 mr-3 text-gray-400" />
        <span className="text-gray-500">Search for services (towels, cleaning, wifi support...)</span>
      </div>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search hotel services..." disabled={isSubmitting || isLoading} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading services...</div>
            ) : (
              <>
                {securityCategory && (
                  <CommandGroup heading={securityCategory.name}>
                    {allItems
                      .filter(item => item.category_id === securityCategory.id && item.is_active)
                      .map((item) => (
                        <CommandItem
                          key={item.id}
                          disabled={isSubmitting}
                          onSelect={() => handleSelect(item.id, item.name, securityCategory.id, item.description)}
                          className="cursor-pointer"
                        >
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
                {Object.entries(itemsByCategory).map(([categoryId, items]) => {
                  if (securityCategory && securityCategory.id === categoryId) return null;
                  const category = categories.find(c => c.id === categoryId);
                  if (!category) return null;
                  
                  return (
                    <CommandGroup key={categoryId} heading={category.name}>
                      {items.map((item) => (
                        <CommandItem
                          key={item.id}
                          disabled={isSubmitting}
                          onSelect={() => handleSelect(item.id, item.name, categoryId, item.description)}
                          className="cursor-pointer"
                        >
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                })}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default CommandSearch;
