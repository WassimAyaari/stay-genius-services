
import React, { useState, useMemo, useCallback } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { requestService } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/hooks/useRoom';
import { useRequestCategories } from '@/hooks/useRequestCategories';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

interface CommandSearchProps {
  room: Room | null;
  onRequestSuccess: () => void;
}

type ItemToRequest = {
  id: string;
  name: string;
  category: string;
  description?: string;
};

const CommandSearch = ({ room, onRequestSuccess }: CommandSearchProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemToRequest | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { categories, allItems, isLoading } = useRequestCategories();
  const { userData } = useAuth();
  
  // Group items by category
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

  // Find security category
  const securityCategory = categories.find(
    (cat) => cat.name?.toLowerCase().includes('secur') || cat.name?.toLowerCase().includes('sécurité') || cat.name?.toLowerCase().includes('security')
  );

  const getActualGuestName = () => {
    const { userData } = useAuth();
    let name = '';
    if (userData) {
      const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
      if (fullName && fullName.toLowerCase() !== 'guest') {
        name = fullName;
      }
    }
    if (!name) {
      const stored = localStorage.getItem('user_data');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const localFullName = `${parsed.first_name || ''} ${parsed.last_name || ''}`.trim();
          if (localFullName && localFullName.toLowerCase() !== 'guest') {
            name = localFullName;
          }
        } catch {}
      }
    }
    return name;
  };

  // Filter items based on search term - memoized to prevent recalculation on every render
  const filterItems = useCallback((items: typeof allItems) => {
    if (!searchTerm) return items;
    
    // Normalize text to handle accents and case
    const normalized = (str?: string) =>
      (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const search = normalized(searchTerm);

    return items.filter(item => {
      const name = normalized(item.name);
      const desc = normalized(item.description);
      
      // Check if name or description contains the search term
      return name.includes(search) || desc.includes(search);
    });
  }, [searchTerm]);

  const handleSelect = (itemId: string, itemName: string, itemCategory: string, itemDescription?: string) => {
    setSelectedItem({
      id: itemId,
      name: itemName,
      category: itemCategory,
      description: itemDescription,
    });
    setConfirmDialogOpen(true);
  };

  const handleConfirmRequest = async () => {
    if (!selectedItem) return;
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
            title: "Room Information Needed",
            description: "We couldn't find your room. Please complete your profile settings.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          setConfirmDialogOpen(false);
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
        `${selectedItem.name}${selectedItem.description ? " - " + selectedItem.description : ""}`,
        selectedItem.id,
        selectedItem.category
      );
      toast({
        title: "Request Sent",
        description: `Your request for "${selectedItem.name}" was sent successfully.`,
      });
      onRequestSuccess();
      setOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error sending request:", error);
      toast({
        title: "Error",
        description: "Could not send the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setConfirmDialogOpen(false);
    }
  };

  // Get filtered items by category for the UI
  const getFilteredItemsForCategory = useCallback((categoryId: string) => {
    const items = itemsByCategory[categoryId] || [];
    return filterItems(items);
  }, [itemsByCategory, filterItems]);

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
          <CommandInput 
            placeholder="Search hotel services..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
            disabled={isSubmitting || isLoading}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading services...</div>
            ) : (
              <>
                {securityCategory && (
                  <CommandGroup heading={securityCategory.name}>
                    {filterItems(
                      allItems.filter(item => item.category_id === securityCategory.id && item.is_active)
                    ).map((item) => (
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
                  
                  // Get filtered items for this category
                  const filtered = getFilteredItemsForCategory(categoryId);
                  
                  if (filtered.length === 0) return null;
                  
                  return (
                    <CommandGroup key={categoryId} heading={category.name}>
                      {filtered.map((item) => (
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
      <Dialog open={confirmDialogOpen} onOpenChange={(open) => { setConfirmDialogOpen(open); if (!open) setSelectedItem(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Service Request</DialogTitle>
            <DialogDescription>
              {selectedItem ? (
                <>
                  Are you sure you want to send a request for <b>{selectedItem.name}</b>?
                  {selectedItem.description && (
                    <>
                      <br />
                      <span className="text-xs text-gray-500">Description: {selectedItem.description}</span>
                    </>
                  )}
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommandSearch;
