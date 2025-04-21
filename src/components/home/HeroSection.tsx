
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty
} from '@/components/ui/command';
import { toast } from '@/components/ui/use-toast';

// Hotel features/services list
const SEARCHABLE_PAGES = [
  { label: "About Us", route: "/about", keywords: "information hotel story" },
  { label: "Gastronomy", route: "/dining", keywords: "dining restaurant food" },
  { label: "Concierge", route: "/services", keywords: "concierge service support" },
  { label: "Spa & Wellness", route: "/spa", keywords: "spa wellness relax" },
  { label: "Shops", route: "/shops", keywords: "shopping shop luxury" },
  { label: "Hotel Map", route: "/map", keywords: "map navigation directions" },
  { label: "Destination", route: "/destination", keywords: "nearby activities" },
  { label: "Events", route: "/events", keywords: "event" },
  { label: "Activities", route: "/activities", keywords: "activity leisure fun" },
  { label: "My Room", route: "/my-room", keywords: "room command requests" },
  { label: "Contact", route: "/contact", keywords: "contact help assistance" },
  { label: "Feedback", route: "/feedback", keywords: "review feedback" },
  // Add more as needed...
];

const normalize = (str: string) =>
  str
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// Main component
const HeroSection = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Handle Ctrl+K or Cmd+K shortcut
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleClearSearch = () => setQuery('');

  // Filter results
  const filteredResults = useMemo(() => {
    if (!query) return SEARCHABLE_PAGES;
    const normQ = normalize(query);
    return SEARCHABLE_PAGES.filter(
      ({ label, keywords }) =>
        normalize(label).includes(normQ) ||
        normalize(keywords).includes(normQ)
    );
  }, [query]);

  const handleSelect = (route: string) => {
    navigate(route);
    setOpen(false);
    setQuery('');
  };

  return (
    <section className="relative mb-8">
      <div className="relative h-64 overflow-hidden rounded-b-3xl">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Hotel Exterior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Stay Guide</h1>
          <p className="text-xl mb-6">Discover luxury and comfort</p>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="absolute -bottom-6 left-6 right-6">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search for services, activities, or amenities..."
            className="w-full pl-12 pr-4 py-4 rounded-xl text-base bg-white shadow-lg border-none"
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
            readOnly
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="px-3 pt-4">
          <div className="flex items-center border-b">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Type to search..." 
              value={query}
              onValueChange={setQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            {query && (
              <button 
                type="button" 
                onClick={handleClearSearch}
                className="ml-2 rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4 opacity-50" />
              </button>
            )}
          </div>
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {filteredResults.map(item => (
              <CommandItem
                key={item.route}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer"
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </section>
  );
};

export default HeroSection;
