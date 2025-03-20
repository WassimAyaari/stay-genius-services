
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from '@/components/ui/command';
import { toast } from '@/components/ui/use-toast';
import { getSearchResults } from './heroSearchUtils';

interface HeroSearchDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
}

const HeroSearchDialog = ({ open, setOpen, query, setQuery }: HeroSearchDialogProps) => {
  const navigate = useNavigate();
  const searchResults = getSearchResults(query);

  // Close command dialog and navigate
  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
    toast({
      title: "Navigating",
      description: "Taking you to the relevant section",
      duration: 2000,
    });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Type to search across the hotel..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.length > 0 ? 
            "No results found. Try different keywords or ask at the reception." : 
            "Start typing to search..."}
        </CommandEmpty>
        
        {searchResults.map((group) => (
          <CommandGroup key={group.category} heading={group.category}>
            {group.items.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => handleSelect(item.path)}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default HeroSearchDialog;
