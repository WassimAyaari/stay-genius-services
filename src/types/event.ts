
export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time?: string;
  location?: string;
  category: 'event' | 'promo';
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'event' | 'promo';
  is_active?: boolean;
  seen?: boolean;
  created_at: string;
  updated_at: string;
  eventId?: string;
}

export type EventsResponse = Event[];

export interface CreateEventDTO {
  title: string;
  description: string;
  image: string;
  date: string;
  time?: string;
  location?: string;
  category: 'event' | 'promo';
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
  id: string;
}
