
export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'event' | 'promo';
  is_featured: boolean;
  location?: string;
  date: string;
  time?: string;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'event' | 'promo';
  is_active: boolean;
  seen: boolean;
  created_at: string;
  updated_at: string;
}
