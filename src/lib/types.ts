
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  floor: number;
  type: string;
  view_type: string | null;
  status: string;
}

export interface ServiceRequest {
  id: string;
  guest_id: string;
  room_id: string;
  type: string;
  description: string | null;
  status: string;
  created_at: string;
}

export interface HotelAbout {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  icon: string;
  action_text: string;
  action_link: string;
  status: string;
}

export interface HotelService {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  icon: string;
  action_text: string;
  action_link: string;
  status: string;
  type: string;
  display_order: number;
}

export interface HotelHero {
  id: string;
  hotel_id: string;
  background_image: string;
  title: string;
  subtitle: string;
  search_placeholder: string;
  status: string;
}

export interface HotelExperience {
  id: string;
  hotel_id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  action_text: string;
  action_link: string;
  category: string;
  display_order: number;
  status: string;
}

export interface HotelEvent {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  action_text: string;
  action_link: string;
  display_order: number;
  status: string;
}

export interface HotelStory {
  id: string;
  hotel_id: string;
  title: string;
  image: string;
  content: string;
  display_order: number;
  status: string;
}

export interface HotelAssistance {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  action_text: string;
  action_link: string;
  background_image: string;
  status: string;
}
