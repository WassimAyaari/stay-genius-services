
import { useSpaServices } from '@/hooks/useSpaServices';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useShops } from '@/hooks/useShops';
import { Leaf, UtensilsCrossed, Store } from 'lucide-react';
import React from 'react';

// Define the SearchOption interface at the top
interface SearchOption {
  label: string;
  route: string;
  keywords: string;
  type: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  image?: string;
  category?: string;
}

const SEARCHABLE_PAGES: SearchOption[] = [
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
];

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const useCommandSearchOptions = () => {
  const { services: spaServices = [] } = useSpaServices();
  const { restaurants = [] } = useRestaurants();
  const { shops = [] } = useShops();

  const spaServiceOptions: SearchOption[] = spaServices.map((service) => ({
    label: service.name,
    route: `/spa?service=${service.id}`,
    keywords: `${service.name} ${service.description ?? ''} spa wellness soins`,
    type: 'spa-service',
    icon: Leaf,
    image: service.image,
    category: "Spa"
  }));

  const restaurantOptions: SearchOption[] = restaurants.map((rest) => ({
    label: rest.name,
    route: `/dining/${rest.id}`,
    keywords: `${rest.name} ${rest.cuisine ?? ''} restaurant gastronomy food ${rest.description ?? ''}`,
    type: 'restaurant',
    icon: UtensilsCrossed,
    image: rest.images?.[0],
    category: "Restaurants",
  }));

  const shopOptions: SearchOption[] = shops.map((shop) => ({
    label: shop.name,
    route: `/shops?shop=${shop.id}`,
    keywords: `${shop.name} ${shop.description ?? ''} shop boutique shopping magasin`,
    type: 'shop',
    icon: Store,
    image: shop.image,
    category: shop.is_hotel_shop ? "Hotel Shops" : "Nearby Shops"
  }));

  const allSearchOptions = [
    ...SEARCHABLE_PAGES,
    ...spaServiceOptions,
    ...restaurantOptions,
    ...shopOptions,
  ];

  const getFilteredResults = (query: string) => {
    if (!query) return allSearchOptions;
    const normQ = normalize(query);
    return allSearchOptions.filter(
      ({ label, keywords }) =>
        normalize(label).includes(normQ) ||
        normalize(keywords ?? '').includes(normQ)
    );
  };

  return { allSearchOptions, getFilteredResults };
};
