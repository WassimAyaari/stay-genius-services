
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Leaf, UtensilsCrossed, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty
} from '@/components/ui/command';
import { toast } from '@/hooks/use-toast';
// Ajouter les hooks pour récupérer les autres services
import { useSpaServices } from '@/hooks/useSpaServices';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useShops } from '@/hooks/useShops';

// Liste des pages/fonctionnalités "fixes" principales de l'hôtel
const SEARCHABLE_PAGES = [
  { label: "About Us", route: "/about", keywords: "information hotel story", type: 'page' },
  { label: "Gastronomy", route: "/dining", keywords: "dining restaurant food", type: 'page' },
  { label: "Concierge", route: "/services", keywords: "concierge service support", type: 'page' },
  { label: "Spa & Wellness", route: "/spa", keywords: "spa wellness relax", type: 'page' },
  { label: "Shops", route: "/shops", keywords: "shopping shop luxury", type: 'page' },
  { label: "Hotel Map", route: "/map", keywords: "map navigation directions", type: 'page' },
  { label: "Destination", route: "/destination", keywords: "nearby activities", type: 'page' },
  { label: "Events", route: "/events", keywords: "event", type: 'page' },
  { label: "Activities", route: "/activities", keywords: "activity leisure fun", type: 'page' },
  { label: "My Room", route: "/my-room", keywords: "room command requests", type: 'page' },
  { label: "Contact", route: "/contact", keywords: "contact help assistance", type: 'page' },
  { label: "Feedback", route: "/feedback", keywords: "review feedback", type: 'page' },
  // ... Ajouter d'autres pages fixes ici si besoin
];

const normalize = (str: string) =>
  str
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const HeroSection = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // 1. Récupérer tous les services, restaurants et shops
  const { services: spaServices = [] } = useSpaServices();
  const { restaurants = [] } = useRestaurants();
  const { shops = [] } = useShops();

  // 2. Préparer chaque option pour la recherche

  // Spa Services (chaque service du spa)
  const spaServiceOptions = spaServices.map((service) => ({
    label: service.name,
    route: `/spa?service=${service.id}`,
    keywords: `${service.name} ${service.description ?? ''} spa wellness soins`,
    type: 'spa-service',
    icon: <Leaf className="w-4 h-4 text-green-600 mr-2 inline" />,
    image: service.image,
    category: "Spa"
  }));

  // Restaurants
  const restaurantOptions = restaurants.map((rest) => ({
    label: rest.name,
    route: `/dining/restaurant/${rest.id}`,
    keywords: `${rest.name} ${rest.cuisine ?? ''} restaurant gastronomy food ${rest.description ?? ''}`,
    type: 'restaurant',
    icon: <UtensilsCrossed className="w-4 h-4 text-primary mr-2 inline" />,
    image: rest.images?.[0],
    category: "Restaurants",
  }));

  // Shops (hôtel & extérieurs)
  const shopOptions = shops.map((shop) => ({
    label: shop.name,
    route: `/shops?shop=${shop.id}`,
    keywords: `${shop.name} ${shop.description ?? ''} shop boutique shopping magasin`,
    type: 'shop',
    icon: <Store className="w-4 h-4 text-yellow-700 mr-2 inline" />,
    image: shop.image,
    category: shop.is_hotel_shop ? "Hotel Shops" : "Nearby Shops"
  }));

  // 3. Fusionner toutes les options (pages principales + chaque item de chaque catégorie)
  const allSearchOptions = [
    ...SEARCHABLE_PAGES,
    ...spaServiceOptions,
    ...restaurantOptions,
    ...shopOptions,
    // ...autres catégories dynamiques à ajouter plus tard ici
  ];

  useEffect(() => {
    // Gestion du raccourci clavier Ctrl+K ou Cmd+K
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

  // 4. Recherche et filtrage sur tous les items/pages
  const filteredResults = useMemo(() => {
    if (!query) return allSearchOptions;
    const normQ = normalize(query);
    return allSearchOptions.filter(
      ({ label, keywords }) =>
        normalize(label).includes(normQ) ||
        normalize(keywords ?? '').includes(normQ)
    );
  }, [query, allSearchOptions]);

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
      
      {/* Barre de recherche principale */}
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
          
          {/* Groupe pages principales */}
          <CommandGroup heading="Pages principales">
            {filteredResults.filter(item => item.type === 'page').map(item => (
              <CommandItem
                key={item.route}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer"
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Groupe Spa */}
          <CommandGroup heading="Spa & Bien-être">
            {filteredResults.filter(item => item.type === 'spa-service').map(item => (
              <CommandItem
                key={item.route}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer flex items-center"
              >
                <Leaf className="w-4 h-4 text-green-600 mr-2" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Groupe Restaurants */}
          <CommandGroup heading="Restaurants">
            {filteredResults.filter(item => item.type === 'restaurant').map(item => (
              <CommandItem
                key={item.route}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer flex items-center"
              >
                <UtensilsCrossed className="w-4 h-4 text-primary mr-2" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Groupe Shops */}
          <CommandGroup heading="Shops">
            {filteredResults.filter(item => item.type === 'shop').map(item => (
              <CommandItem
                key={item.route}
                onSelect={() => handleSelect(item.route)}
                className="cursor-pointer flex items-center"
              >
                <Store className="w-4 h-4 text-yellow-700 mr-2" />
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

