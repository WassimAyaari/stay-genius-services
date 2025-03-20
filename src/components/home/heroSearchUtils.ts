
import React from 'react';
import { 
  Utensils, 
  BedDouble, 
  Spa, 
  Map, 
  ShoppingBag, 
  Dumbbell, 
  Calendar, 
  Coffee, 
  Phone, 
  Info, 
  MessageSquare 
} from 'lucide-react';

// Define the structure of a search result item
interface SearchResultItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
}

// Define the structure of a search result group
interface SearchResultGroup {
  category: string;
  items: SearchResultItem[];
}

// Function to get search results based on a query
export const getSearchResults = (query: string): SearchResultGroup[] => {
  const lowerQuery = query.toLowerCase();

  // Define all available search items
  const allItems: SearchResultGroup[] = [
    {
      category: 'Rooms & Suites',
      items: [
        {
          id: 'deluxe-room',
          title: 'Deluxe Room',
          path: '/rooms/deluxe',
          icon: <BedDouble size={16} />
        },
        {
          id: 'suite',
          title: 'Executive Suite',
          path: '/rooms/suite',
          icon: <BedDouble size={16} />
        },
        {
          id: 'presidential',
          title: 'Presidential Suite',
          path: '/rooms/presidential',
          icon: <BedDouble size={16} />
        },
        {
          id: 'my-room',
          title: 'My Room',
          path: '/my-room',
          icon: <BedDouble size={16} />
        }
      ]
    },
    {
      category: 'Dining',
      items: [
        {
          id: 'restaurant',
          title: 'Main Restaurant',
          path: '/dining/restaurant',
          icon: <Utensils size={16} />
        },
        {
          id: 'bar',
          title: 'Lobby Bar',
          path: '/dining/bar',
          icon: <Coffee size={16} />
        },
        {
          id: 'room-service',
          title: 'Room Service',
          path: '/dining/room-service',
          icon: <Utensils size={16} />
        }
      ]
    },
    {
      category: 'Wellness',
      items: [
        {
          id: 'spa',
          title: 'Spa Services',
          path: '/spa',
          icon: <Spa size={16} />
        },
        {
          id: 'gym',
          title: 'Fitness Center',
          path: '/fitness',
          icon: <Dumbbell size={16} />
        }
      ]
    },
    {
      category: 'Hotel Services',
      items: [
        {
          id: 'concierge',
          title: 'Concierge',
          path: '/services/concierge',
          icon: <Info size={16} />
        },
        {
          id: 'housekeeping',
          title: 'Housekeeping',
          path: '/services/housekeeping',
          icon: <BedDouble size={16} />
        },
        {
          id: 'events',
          title: 'Events',
          path: '/events',
          icon: <Calendar size={16} />
        },
        {
          id: 'shops',
          title: 'Hotel Shops',
          path: '/shops',
          icon: <ShoppingBag size={16} />
        },
        {
          id: 'map',
          title: 'Hotel Map',
          path: '/map',
          icon: <Map size={16} />
        }
      ]
    },
    {
      category: 'Help & Contact',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          path: '/help',
          icon: <Info size={16} />
        },
        {
          id: 'contact',
          title: 'Contact Us',
          path: '/contact',
          icon: <Phone size={16} />
        },
        {
          id: 'feedback',
          title: 'Feedback',
          path: '/feedback',
          icon: <MessageSquare size={16} />
        }
      ]
    }
  ];

  // If no query, return all items
  if (!query || query.trim() === '') {
    return allItems;
  }

  // Filter items based on the query
  const filteredGroups = allItems.map(group => {
    const filteredItems = group.items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      group.category.toLowerCase().includes(lowerQuery)
    );
    
    return {
      ...group,
      items: filteredItems
    };
  }).filter(group => group.items.length > 0);

  return filteredGroups;
};
