
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandInput
} from '@/components/ui/command';
import { toast } from '@/components/ui/use-toast';
import { useAboutData } from '@/hooks/useAboutData';

const HeroSection = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { aboutData } = useAboutData();
  
  // Default image if aboutData is not available
  const heroImage = aboutData?.hero_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';

  useEffect(() => {
    // Close search with Escape key
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleClearSearch = () => {
    setQuery('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    
    if (query.trim()) {
      toast({
        title: "Search",
        description: "Taking you to relevant results",
        duration: 2000,
      });
      navigate('/map');
    }
    
    setQuery('');
  };

  return (
    <section className="relative mb-8">
      <div className="relative h-64 overflow-hidden rounded-b-3xl">
        <img 
          src={heroImage}
          alt="Hotel Exterior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{aboutData?.welcome_title || "Welcome to Your Stay Guide"}</h1>
          <p className="text-xl mb-6">{aboutData?.welcome_description || "Discover luxury and comfort"}</p>
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
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <form onSubmit={handleSearch}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Type to search..." 
              value={query}
              onValueChange={setQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
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
        </form>
      </CommandDialog>
    </section>
  );
};

export default HeroSection;
