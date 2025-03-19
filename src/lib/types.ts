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

export interface Hotel {
  id: string;
  name: string;
  address: string;
  logo_url: string | null;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
}

export const defaultHotelHero: HotelHero = {
  id: '',
  hotel_id: '',
  background_image: '/placeholder.svg',
  title: 'Bienvenue dans notre hôtel',
  subtitle: 'Découvrez une expérience unique',
  search_placeholder: 'Rechercher un service...',
  status: 'active'
};

export const defaultHotelExperience: HotelExperience = {
  id: '',
  hotel_id: '',
  title: 'Nouvelle expérience',
  subtitle: 'Découvrez notre nouvelle expérience',
  description: 'Description de l\'expérience',
  image: '/placeholder.svg',
  action_text: 'Explorer',
  action_link: '#',
  category: 'général',
  display_order: 0,
  status: 'active'
};

export const defaultHotelEvent: HotelEvent = {
  id: '',
  hotel_id: '',
  title: 'Nouvel événement',
  description: 'Description de l\'événement',
  image: '/placeholder.svg',
  date: new Date().toISOString().split('T')[0],
  time: '18:00',
  location: 'Hôtel',
  action_text: 'Réserver',
  action_link: '#',
  display_order: 0,
  status: 'active'
};

export const defaultHotelStory: HotelStory = {
  id: '',
  hotel_id: '',
  title: 'Nouvelle story',
  image: '/placeholder.svg',
  content: 'Contenu de la story',
  display_order: 0,
  status: 'active'
};

export const defaultHotelAssistance: HotelAssistance = {
  id: '',
  hotel_id: '',
  title: 'Besoin d\'assistance ?',
  description: 'Notre équipe est disponible 24/7 pour vous aider',
  action_text: 'Contacter',
  action_link: '/contact',
  background_image: '/placeholder.svg',
  status: 'active'
};
