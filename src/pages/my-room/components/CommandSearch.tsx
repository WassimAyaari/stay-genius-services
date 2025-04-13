
import React, { useState } from 'react';
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

interface SearchItem {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface CommandSearchProps {
  room: Room | null;
  onRequestSuccess: () => void;
}

const CommandSearch = ({ room, onRequestSuccess }: CommandSearchProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Mock data - in a real implementation, this would come from an API request using requestCategories and requestItems
  const items: SearchItem[] = [
    { id: '1', name: 'Extra Towels', category: 'Housekeeping', description: 'Request additional towels for your room' },
    { id: '2', name: 'Room Cleaning', category: 'Housekeeping', description: 'Schedule a room cleaning service' },
    { id: '3', name: 'Laundry Pickup', category: 'Laundry', description: 'Request laundry pickup from your room' },
    { id: '4', name: 'WiFi Support', category: 'Technical', description: 'Get assistance with WiFi connection' },
    { id: '5', name: 'Pillow Options', category: 'Bedding', description: 'Choose from our pillow menu' },
    { id: '6', name: 'Toothbrush Kit', category: 'Amenities', description: 'Request a toothbrush and toothpaste kit' },
    { id: '7', name: 'Shower Gel', category: 'Amenities', description: 'Request additional shower gel' },
    { id: '8', name: 'Room Service Menu', category: 'Dining', description: 'Get a room service menu delivered' },
    { id: '9', name: 'TV Remote Issue', category: 'Technical', description: 'Report problems with the TV remote' },
    { id: '10', name: 'Spa Appointment', category: 'Wellness', description: 'Book a spa treatment appointment' },
  ];

  const handleSelect = async (item: SearchItem) => {
    setIsSubmitting(true);
    try {
      if (!room) {
        toast({
          title: "Error",
          description: "Room information is missing. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      await requestService(
        room.id,
        'service',
        `${item.name} - ${item.description || ''}`,
        undefined,
        undefined
      );
      
      toast({
        title: "Request Submitted",
        description: `Your request for ${item.name} has been submitted successfully.`,
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
        <span className="text-gray-500">Search for services (towels, cleaning, wifi support...)
        </span>
      </div>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Search hotel services..." disabled={isSubmitting} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(
              items.reduce<Record<string, SearchItem[]>>((acc, item) => {
                if (!acc[item.category]) {
                  acc[item.category] = [];
                }
                acc[item.category].push(item);
                return acc;
              }, {})
            ).map(([category, categoryItems]) => (
              <CommandGroup key={category} heading={category}>
                {categoryItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    disabled={isSubmitting}
                    onSelect={() => handleSelect(item)}
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
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default CommandSearch;
