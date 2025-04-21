
import { useSpaServices } from '@/hooks/useSpaServices';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useShops } from '@/hooks/useShops';
import { Leaf, UtensilsCrossed, Store } from 'lucide-react';

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

  const spaServiceOptions = spaServices.map((service) => ({
    label: service.name,
    route: `/spa?service=${service.id}`,
    keywords: `${service.name} ${service.description ?? ''} spa wellness soins`,
    type: 'spa-service',
    icon: <Leaf className="w-4 h-4 text-green-600 mr-2 inline" />,
    image: service.image,
    category: "Spa"
  }));

  const restaurantOptions = restaurants.map((rest) => ({
    label: rest.name,
    route: `/dining/${rest.id}`,
    keywords: `${rest.name} ${rest.cuisine ?? ''} restaurant gastronomy food ${rest.description ?? ''}`,
    type: 'restaurant',
    icon: <UtensilsCrossed className="w-4 h-4 text-primary mr-2 inline" />,
    image: rest.images?.[0],
    category: "Restaurants",
  }));

  const shopOptions = shops.map((shop) => ({
    label: shop.name,
    route: `/shops?shop=${shop.id}`,
    keywords: `${shop.name} ${shop.description ?? ''} shop boutique shopping magasin`,
    type: 'shop',
    icon: <Store className="w-4 h-4 text-yellow-700 mr-2 inline" />,
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
