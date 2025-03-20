
import React from 'react';
import { 
  UtensilsCrossed, BedDouble, Heart, Calendar, Phone, 
  Map, ShoppingBag, Compass, Info, Coffee, Utensils,
  Shirt, Wifi, Bell, Clock, ShieldCheck, CreditCard,
  Droplets, Dumbbell, Waves
} from 'lucide-react';

// Define the search result item structure
export interface SearchResultItem {
  id: string;
  title: string;
  path: string;
  keywords: string[];
  icon: React.ReactNode;
}

// Define the search result group structure
export interface SearchResultGroup {
  category: string;
  items: SearchResultItem[];
}

// Search results processor
export function getSearchResults(query: string): SearchResultGroup[] {
  // Base search categories with their items
  const baseCategories: SearchResultGroup[] = [
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
        },
        { 
          id: "breakfast-service", 
          title: "Breakfast Service", 
          path: "/dining/breakfast",
          keywords: ["breakfast", "morning", "coffee", "buffet", "continental"],
          icon: <Coffee className="h-4 w-4" /> 
        },
        { 
          id: "room-service", 
          title: "Room Service", 
          path: "/my-room/dining",
          keywords: ["room service", "in-room dining", "delivery", "private dining"],
          icon: <Utensils className="h-4 w-4" /> 
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
        },
        { 
          id: "fitness-center", 
          title: "Fitness Center", 
          path: "/wellness/fitness",
          keywords: ["gym", "workout", "fitness", "exercise", "training"],
          icon: <Dumbbell className="h-4 w-4" /> 
        },
        { 
          id: "swimming-pool", 
          title: "Swimming Pool", 
          path: "/wellness/pool",
          keywords: ["pool", "swim", "jacuzzi", "sauna", "water"],
          icon: <Waves className="h-4 w-4" /> 
        },
        { 
          id: "thermal-baths", 
          title: "Thermal Baths", 
          path: "/wellness/thermal",
          keywords: ["bath", "thermal", "hot springs", "relaxation"],
          icon: <Droplets className="h-4 w-4" /> 
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
        },
        { 
          id: "housekeeping", 
          title: "Housekeeping", 
          path: "/services/housekeeping",
          keywords: ["cleaning", "housekeeping", "towels", "room service", "laundry"],
          icon: <Shirt className="h-4 w-4" /> 
        },
        { 
          id: "wifi-access", 
          title: "Wi-Fi Access", 
          path: "/services/wifi",
          keywords: ["wifi", "internet", "connection", "network"],
          icon: <Wifi className="h-4 w-4" /> 
        },
        { 
          id: "room-service-general", 
          title: "Room Service", 
          path: "/services/room-service",
          keywords: ["service", "room", "assistance", "help", "request"],
          icon: <Bell className="h-4 w-4" /> 
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
        },
        { 
          id: "daily-schedule", 
          title: "Daily Schedule", 
          path: "/activities/schedule",
          keywords: ["schedule", "program", "agenda", "timetable", "daily"],
          icon: <Clock className="h-4 w-4" /> 
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
        },
        { 
          id: "security", 
          title: "Security Information", 
          path: "/services/security",
          keywords: ["security", "safety", "emergency", "help", "assistance"],
          icon: <ShieldCheck className="h-4 w-4" /> 
        },
        { 
          id: "payment", 
          title: "Payment Options", 
          path: "/services/payment",
          keywords: ["payment", "bill", "invoice", "credit card", "cash", "checkout"],
          icon: <CreditCard className="h-4 w-4" /> 
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
    "tired": ["spa", "massage", "wellness", "room"],
    
    // Specific needs
    "internet": ["wifi", "connection"],
    "workout": ["gym", "fitness"],
    "swim": ["pool", "spa"],
    "pay": ["checkout", "bill", "payment"],
    "emergency": ["security", "help", "assistance"],
    "checkout": ["payment", "reception", "bill"],
    "tours": ["destination", "activities", "local"],
    "buy": ["shops", "shopping", "purchase"]
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
