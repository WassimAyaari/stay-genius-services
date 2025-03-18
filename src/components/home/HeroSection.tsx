
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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

const HeroSection = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
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
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

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
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </section>
  );
};

// Search results processor
function getSearchResults(query: string) {
  // Import icons at function level to avoid React hook rules violation
  const { 
    UtensilsCrossed, BedDouble, Heart, Calendar, Phone, 
    Map, ShoppingBag, Compass, Info
  } = require('lucide-react');

  // Base search categories with their items
  const baseCategories = [
    {
      category: "Dining",
      items: [
        { 
          id: "restaurant-grand-bistro", 
          title: "The Grand Bistro", 
          path: "/dining/1",
          keywords: ["food", "restaurant", "bistro", "dining", "eat", "breakfast", "lunch", "dinner", "meal"],
          icon: <UtensilsCrossed className="h-4 w-4" /> 
        },
        { 
          id: "restaurant-sakura", 
          title: "Sakura Japanese", 
          path: "/dining/2",
          keywords: ["food", "restaurant", "japanese", "sushi", "asian", "dining", "eat"],
          icon: <UtensilsCrossed className="h-4 w-4" /> 
        },
        { 
          id: "dining-all", 
          title: "All Restaurants", 
          path: "/dining",
          keywords: ["food", "restaurants", "dining", "eat", "all restaurants"],
          icon: <UtensilsCrossed className="h-4 w-4" /> 
        }
      ]
    },
    {
      category: "Wellness",
      items: [
        { 
          id: "spa-services", 
          title: "Spa Services", 
          path: "/spa",
          keywords: ["spa", "massage", "wellness", "relax", "facial", "treatment"],
          icon: <Heart className="h-4 w-4" /> 
        }
      ]
    },
    {
      category: "Accommodation",
      items: [
        { 
          id: "my-room", 
          title: "My Room", 
          path: "/my-room",
          keywords: ["room", "suite", "bed", "sleep", "accommodation", "my room", "housekeeping"],
          icon: <BedDouble className="h-4 w-4" /> 
        }
      ]
    },
    {
      category: "Activities",
      items: [
        { 
          id: "activities-all", 
          title: "All Activities", 
          path: "/activities",
          keywords: ["activity", "events", "entertainment", "things to do", "fun"],
          icon: <Calendar className="h-4 w-4" /> 
        },
        { 
          id: "hotel-map", 
          title: "Hotel Map", 
          path: "/map",
          keywords: ["map", "directions", "location", "find", "navigation"],
          icon: <Map className="h-4 w-4" /> 
        }
      ]
    },
    {
      category: "Hotel Information",
      items: [
        { 
          id: "services", 
          title: "Services", 
          path: "/services",
          keywords: ["service", "assistance", "help", "concierge", "support"],
          icon: <Phone className="h-4 w-4" /> 
        },
        { 
          id: "about", 
          title: "About The Hotel", 
          path: "/about",
          keywords: ["about", "hotel", "information", "history", "details"],
          icon: <Info className="h-4 w-4" /> 
        },
        { 
          id: "shops", 
          title: "Hotel Shops", 
          path: "/shops",
          keywords: ["shop", "shopping", "retail", "buy", "purchase", "gift", "souvenir"],
          icon: <ShoppingBag className="h-4 w-4" /> 
        },
        { 
          id: "destination", 
          title: "Local Destination", 
          path: "/destination",
          keywords: ["destination", "local", "attractions", "sightseeing", "tour", "explore"],
          icon: <Compass className="h-4 w-4" /> 
        }
      ]
    }
  ];

  // If no query, return all categories
  if (!query || query.length === 0) {
    return baseCategories;
  }

  // Search in keywords and title
  const normalizedQuery = query.toLowerCase().trim();
  
  // Context-aware mapping for common hotel queries
  const contextMap: Record<string, string[]> = {
    // Food and dining related
    "hungry": ["food", "restaurant", "dining"],
    "eat": ["food", "restaurant", "dining"],
    "breakfast": ["food", "restaurant", "dining", "breakfast"],
    "lunch": ["food", "restaurant", "dining"],
    "dinner": ["food", "restaurant", "dining"],
    "meal": ["food", "restaurant", "dining"],
    
    // Room related
    "sleep": ["room", "bed", "accommodation"],
    "rest": ["room", "spa", "relax"],
    "clean": ["housekeeping", "room", "service"],
    "towel": ["housekeeping", "room", "service"],
    "pillow": ["housekeeping", "room", "service"],
    
    // Activities
    "bored": ["activity", "entertainment", "things to do"],
    "fun": ["activity", "entertainment", "events"],
    
    // Services
    "help": ["service", "assistance", "concierge"],
    "need": ["service", "assistance", "concierge"],
    "broken": ["service", "assistance", "maintenance"],
    
    // Spa related
    "relax": ["spa", "massage", "wellness"],
    "tired": ["spa", "massage", "wellness", "room"]
  };

  // Expand query with context terms
  let searchTerms = [normalizedQuery];
  
  // Add contextual related terms if they exist
  Object.entries(contextMap).forEach(([contextTerm, relatedTerms]) => {
    if (normalizedQuery.includes(contextTerm)) {
      searchTerms = [...searchTerms, ...relatedTerms];
    }
  });

  // Filter categories and items based on expanded search terms
  const filteredCategories = baseCategories
    .map(category => {
      // Filter items in each category
      const filteredItems = category.items.filter(item => {
        return searchTerms.some(term => 
          item.title.toLowerCase().includes(term) || 
          item.keywords.some(keyword => keyword.includes(term))
        );
      });
      
      // Return category with filtered items
      return {
        ...category,
        items: filteredItems
      };
    })
    .filter(category => category.items.length > 0); // Keep only categories with matching items

  return filteredCategories;
}

export default HeroSection;
