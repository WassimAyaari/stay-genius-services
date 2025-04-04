
export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'event' | 'promo';
  date: string;
  time?: string;
  location?: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'event' | 'promo';
  created_at: string;
  updated_at: string;
  is_active: boolean;
  seen: boolean;
}
