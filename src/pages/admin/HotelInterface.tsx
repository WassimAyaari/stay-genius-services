import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Info, Palette, Grid, Layout, Image, 
  Compass, Star, MessageSquare, Calendar, Film, ShoppingBag, 
  HeartHandshake, Utensils, PhoneCall, Sparkles, Clock, Map, Plus, Trash2, Edit, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from "@/integrations/supabase/client";
import { 
  HotelAbout, HotelService, HotelHero, HotelExperience, 
  HotelEvent, HotelStory, HotelAssistance, Hotel as HotelType,
  defaultHotelHero, defaultHotelExperience, defaultHotelEvent,
  defaultHotelStory, defaultHotelAssistance  
} from '@/lib/types';

interface HotelData {
  id: string;
  name: string;
}

const HotelInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [hotel, setHotel] = useState<HotelData | null>(null);
  
  // États pour chaque type de contenu
  const [aboutSections, setAboutSections] = useState<HotelAbout[]>([]);
  const [services, setServices] = useState<HotelService[]>([]);
  const [hero, setHero] = useState<HotelHero | null>(null);
  const [experiences, setExperiences] = useState<HotelExperience[]>([]);
  const [events, setEvents] = useState<HotelEvent[]>([]);
  const [stories, setStories] = useState<HotelStory[]>([]);
  const [assistance, setAssistance] = useState<HotelAssistance | null>(null);
  
  // États pour l'édition
  const [editingAbout, setEditingAbout] = useState<HotelAbout | null>(null);
  const [editingService, setEditingService] = useState<HotelService | null>(null);
  const [editingHero, setEditingHero] = useState<HotelHero | null>(null);
  const [editingExperience, setEditingExperience] = useState<HotelExperience | null>(null);
  const [editingEvent, setEditingEvent] = useState<HotelEvent | null>(null);
  const [editingStory, setEditingStory] = useState<HotelStory | null>(null);
  const [editingAssistance, setEditingAssistance] = useState<HotelAssistance | null>(null);
  
  // Variables pour les aperçus
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  useEffect(() => {
    fetchHotelData();
  }, [id]);

  const fetchHotelData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Fetch hotel
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', id)
        .single();
      
      if (hotelError) throw hotelError;
      setHotel(hotelData);
      
      // Fetch about sections
      const { data: aboutData, error: aboutError } = await supabase
        .from('hotel_about')
        .select('*')
        .eq('hotel_id', id)
        .order('title');
      
      if (aboutError) throw aboutError;
      setAboutSections(aboutData || []);
      
      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('hotel_services')
        .select('*')
        .eq('hotel_id', id)
        .order('display_order');
      
      if (servicesError) throw servicesError;
      setServices(servicesData || []);
      
      // Fetch hero section
      const { data: heroData, error: heroError } = await supabase
        .from('hotel_hero')
        .select('*')
        .eq('hotel_id', id)
        .single();
      
      if (!heroError) {
        setHero(heroData);
      }
      
      // Fetch experiences
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('hotel_experiences')
        .select('*')
        .eq('hotel_id', id)
        .order('display_order');
      
      if (!experiencesError) {
        setExperiences(experiencesData || []);
      }
      
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('hotel_events')
        .select('*')
        .eq('hotel_id', id)
        .order('display_order');
      
      if (!eventsError) {
        setEvents(eventsData || []);
      }
      
      // Fetch stories
      const { data: storiesData, error: storiesError } = await supabase
        .from('hotel_stories')
        .select('*')
        .eq('hotel_id', id)
        .order('display_order');
      
      if (!storiesError) {
        setStories(storiesData || []);
      }
      
      // Fetch assistance
      const { data: assistanceData, error: assistanceError } = await supabase
        .from('hotel_assistance')
        .select('*')
        .eq('hotel_id', id)
        .single();
      
      if (!assistanceError) {
        setAssistance(assistanceData);
      }
      
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      toast.error("Erreur lors du chargement des données de l'hôtel");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async (about: HotelAbout) => {
    setLoading(true);
    try {
      if (about.id) {
        // Update existing about section
        const { error } = await supabase
          .from('hotel_about')
          .update({
            title: about.title,
            description: about.description,
            icon: about.icon,
            action_text: about.action_text,
            action_link: about.action_link,
            status: about.status,
          })
          .eq('id', about.id);
          
        if (error) throw error;
        
        setAboutSections(aboutSections.map(item => 
          item.id === about.id ? about : item
        ));
        
        toast.success('Section À propos mise à jour');
      } else {
        // Create new about section
        const { data, error } = await supabase
          .from('hotel_about')
          .insert({
            hotel_id: id,
            title: about.title,
            description: about.description,
            icon: about.icon,
            action_text: about.action_text,
            action_link: about.action_link,
            status: about.status || 'active',
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setAboutSections([...aboutSections, data]);
        toast.success('Section À propos ajoutée');
      }
      
      setEditingAbout(null);
    } catch (error) {
      console.error('Error saving about section:', error);
      toast.error("Erreur lors de l'enregistrement de la section À propos");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (service: HotelService) => {
    setLoading(true);
    try {
      if (service.id) {
        // Update existing service
        const { error } = await supabase
          .from('hotel_services')
          .update({
            title: service.title,
            description: service.description,
            icon: service.icon,
            action_text: service.action_text,
            action_link: service.action_link,
            status: service.status,
            type: service.type,
            display_order: service.display_order,
          })
          .eq('id', service.id);
          
        if (error) throw error;
        
        setServices(services.map(item => 
          item.id === service.id ? service : item
        ));
        
        toast.success('Service mis à jour');
      } else {
        // Create new service
        const { data, error } = await supabase
          .from('hotel_services')
          .insert({
            hotel_id: id,
            title: service.title,
            description: service.description,
            icon: service.icon,
            action_text: service.action_text,
            action_link: service.action_link,
            status: service.status || 'active',
            type: service.type || 'main',
            display_order: service.display_order || 0,
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setServices([...services, data]);
        toast.success('Service ajouté');
      }
      
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error("Erreur lors de l'enregistrement du service");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async (heroData: HotelHero) => {
    setLoading(true);
    try {
      if (heroData.id) {
        // Update existing hero
        const { error } = await supabase
          .from('hotel_hero')
          .update({
            background_image: heroData.background_image,
            title: heroData.title,
            subtitle: heroData.subtitle,
            search_placeholder: heroData.search_placeholder,
            status: heroData.status,
          })
          .eq('id', heroData.id);
          
        if (error) throw error;
        
        setHero(heroData);
        toast.success('Section Héro mise à jour');
      } else {
        // Create new hero
        const { data, error } = await supabase
          .from('hotel_hero')
          .insert({
            hotel_id: id,
            background_image: heroData.background_image,
            title: heroData.title,
            subtitle: heroData.subtitle,
            search_placeholder: heroData.search_placeholder,
            status: heroData.status || 'active',
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setHero(data);
        toast.success('Section Héro ajoutée');
      }
      
      setEditingHero(null);
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error("Erreur lors de l'enregistrement de la section Héro");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExperience = async (experience: HotelExperience) => {
    setLoading(true);
    try {
      if (experience.id) {
        // Update existing experience
        const { error } = await supabase
          .from('hotel_experiences')
          .update({
            title: experience.title,
            subtitle: experience.subtitle,
            description: experience.description,
            image: experience.image,
            action_text: experience.action_text,
            action_link: experience.action_link,
            category: experience.category,
            display_order: experience.display_order,
            status: experience.status,
          })
          .eq('id', experience.id);
          
        if (error) throw error;
        
        setExperiences(experiences.map(item => 
          item.id === experience.id ? experience : item
        ));
        
        toast.success('Expérience mise à jour');
      } else {
        // Create new experience
        const { data, error } = await supabase
          .from('hotel_experiences')
          .insert({
            hotel_id: id,
            title: experience.title,
            subtitle: experience.subtitle,
            description: experience.description,
            image: experience.image,
            action_text: experience.action_text,
            action_link: experience.action_link,
            category: experience.category,
            display_order: experience.display_order || experiences.length,
            status: experience.status || 'active',
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setExperiences([...experiences, data]);
        toast.success('Expérience ajoutée');
      }
      
      setEditingExperience(null);
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error("Erreur lors de l'enregistrement de l'expérience");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async (event: HotelEvent) => {
    setLoading(true);
    try {
      if (event.id) {
        // Update existing event
        const { error } = await supabase
          .from('hotel_events')
          .update({
            title: event.title,
            description: event.description,
            image: event.image,
            date: event.date,
            time: event.time,
            location: event.location,
            action_text: event.action_text,
            action_link: event.action_link,
            display_order: event.display_order,
            status: event.status,
          })
          .eq('id', event.id);
          
        if (error) throw error;
        
        setEvents(events.map(item => 
          item.id === event.id ? event : item
        ));
        
        toast.success('Événement mis à jour');
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('hotel_events')
          .insert({
            hotel_id: id,
            title: event.title,
            description: event.description,
            image: event.image,
            date: event.date,
            time: event.time,
            location: event.location,
            action_text: event.action_text,
            action_link: event.action_link,
            display_order: event.display_order || events.length,
            status: event.status || 'active',
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setEvents([...events, data]);
        toast.success('Événement ajouté');
      }
      
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error("Erreur lors de l'enregistrement de l'événement");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStory = async (story: HotelStory) => {
    setLoading(true);
    try {
      if (story.id) {
        // Update existing story
        const { error } = await supabase
          .from('hotel_stories')
          .update({
            title: story.title,
            image: story.image,
            content: story.content,
            display_order: story.display_order,
            status: story.status,
          })
          .eq('id', story.id);
          
        if (error) throw error;
        
        setStories(stories.map(item => 
          item.id === story.id ? story : item
        ));
        
        toast.success('Story mise à jour');
      } else {
        // Create new story
        const { data, error } = await supabase
          .from('hotel_stories')
          .insert({
            hotel_id: id,
            title: story.title,
            image: story.image,
            content: story.content,
            display_order: story.display_order || stories.length,
            status: story.status || 'active',
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setStories([...stories, data]);
        toast.success('Story ajoutée');
      }
      
      setEditingStory(null);
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error("Erreur lors de l'enregistrement de la story");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssistance = async (assistanceData: HotelAssistance) => {
    setLoading(true);
    try {
      if (assistanceData.id) {
        // Update existing assistance
        const { error } = await supabase
          .from('hotel_assistance')
          .update({
            title: assistanceData.title,
            description: assistanceData.description,
            action_text: assistanceData.action_text,
            action_link: assistanceData.action_link,
            background_image: assistanceData.background_image,
            status: assistanceData.status,
          })
          .eq('id', assistanceData.id);
          
        if (error) throw error;
        
        setAssistance(assistanceData);
        toast.success('Section Assistance mise à jour');
      } else {
        // Create new assistance
        const { data, error } = await supabase
          .from('hotel_assistance')
          .insert({
            hotel_id: id,
            title: assistanceData.title,
            description: assistanceData.description,
            action_text: assistanceData.action_text,
            action_link: assistanceData.action_link,
            background_image: assistanceData.background_image,
            status: assistanceData.status || 'active',
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setAssistance(data);
        toast.success('Section Assistance ajoutée');
      }
      
      setEditingAssistance(null);
    } catch (error) {
      console.error('Error saving assistance section:', error);
      toast.error("Erreur lors de l'enregistrement de la section Assistance");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAbout = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette section ?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('hotel_about')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setAboutSections(aboutSections.filter(item => item.id !== id));
      toast.success('Section supprimée');
    } catch (error) {
      console.error('Error deleting about section:', error);
      toast.error("Erreur lors de la suppression de la section");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('hotel_services')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setServices(services.filter(item => item.id !== id));
      toast.success('Service supprimé');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Erreur lors de la suppression du service");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('hotel_experiences')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setExperiences(experiences.filter(item => item.id !== id));
      toast.success('Expérience supprimée');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error("Erreur lors de la suppression de l'expérience");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('hotel_events')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setEvents(events.filter(item => item.id !== id));
      toast.success('Événement supprimé');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("Erreur lors de la suppression de l'événement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette story ?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('hotel_stories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setStories(stories.filter(item => item.id !== id));
      toast.success('Story supprimée');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error("Erreur lors de la suppression de la story");
    } finally {
      setLoading(false);
    }
  };

  const AboutForm = ({ about, onSave, onCancel }: { 
    about: HotelAbout, 
    onSave: (about: HotelAbout) => void, 
    onCancel: () => void 
  }) => {
    const [form, setForm] = useState<HotelAbout>(about);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Notre Histoire" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icône</label>
            <Input 
              name="icon" 
              value={form.icon} 
              onChange={handleChange} 
              placeholder="Info" 
              required 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Description de la section" 
            rows={4} 
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Texte du bouton</label>
            <Input 
              name="action_text" 
              value={form.action_text} 
              onChange={handleChange} 
              placeholder="En savoir plus" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lien du bouton</label>
            <Input 
              name="action_link" 
              value={form.action_link} 
              onChange={handleChange} 
              placeholder="/about" 
              required 
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    );
  };

  const ServiceForm = ({ service, onSave, onCancel }: { 
    service: HotelService, 
    onSave: (service: HotelService) => void, 
    onCancel: () => void 
  }) => {
    const [form, setForm] = useState<HotelService>(service);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Restaurant" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icône</label>
            <Input 
              name="icon" 
              value={form.icon} 
              onChange={handleChange} 
              placeholder="UtensilsCrossed" 
              required 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Description du service" 
            rows={4} 
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Texte du bouton</label>
            <Input 
              name="action_text" 
              value={form.action_text} 
              onChange={handleChange} 
              placeholder="Réserver" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lien du bouton</label>
            <Input 
              name="action_link" 
              value={form.action_link} 
              onChange={handleChange} 
              placeholder="/dining" 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select 
              name="type" 
              value={form.type} 
              onChange={handleChange} 
              className="w-full p-2 border rounded"
              required
            >
              <option value="main">Principal</option>
              <option value="additional">Additionnel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
            <Input 
              type="number"
              name="display_order" 
              value={form.display_order.toString()} 
              onChange={handleChange} 
              min={0}
              required 
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    );
  };

  const HeroForm = ({ hero, onSave, onCancel }: { 
    hero: HotelHero, 
    onSave: (hero: HotelHero) => void, 
    onCancel: () => void 
  }) => {
    const [form, setForm] = useState<HotelHero>(hero);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Image d'arrière-plan</label>
          <Input 
            name="background_image" 
            value={form.background_image} 
            onChange={handleChange} 
            placeholder="URL de l'image" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <Input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="Bienvenue à l'Hôtel Exemple" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sous-titre</label>
          <Input 
            name="subtitle" 
            value={form.subtitle} 
            onChange={handleChange} 
            placeholder="Découvrez le luxe et le confort" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Texte placeholder de recherche</label>
          <Input 
            name="search_placeholder" 
            value={form.search_placeholder} 
            onChange={handleChange} 
            placeholder="Rechercher..." 
            required 
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    );
  };

  const ExperienceForm = ({ experience, onSave, onCancel }: { 
    experience: HotelExperience, 
    onSave: (experience: HotelExperience) => void, 
    onCancel: () => void 
  }) => {
    const [form, setForm] = useState<HotelExperience>(experience);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Spa & Bien-être" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sous-titre</label>
            <Input 
              name="subtitle" 
              value={form.subtitle} 
              onChange={handleChange} 
              placeholder="Détendez-vous et ressourcez-vous" 
              required 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <Input 
            name="image" 
            value={form.image} 
            onChange={handleChange} 
            placeholder="URL de l'image" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Description de l'expérience" 
            rows={4} 
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <Input 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              placeholder="wellness" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
            <Input 
              type="number"
              name="display_order" 
              value={form.display_order.toString()} 
              onChange={handleChange} 
              min={0}
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Texte du bouton</label>
            <Input 
              name="action_text" 
              value={form.action_text} 
              onChange={handleChange} 
              placeholder="Réserver" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lien du bouton</label>
            <Input 
              name="action_link" 
              value={form.action_link} 
              onChange={handleChange} 
              placeholder="/spa" 
              required 
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    );
  };

  const EventForm = ({ event, onSave, onCancel }: { 
    event: HotelEvent, 
    onSave: (event: HotelEvent) => void, 
    onCancel: () => void 
  }) => {
    const [form, setForm] = useState<HotelEvent>(event);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Soirée Jazz" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <Input 
              name="image" 
              value={form.image} 
              onChange={handleChange} 
              placeholder="URL de l'image" 
              required 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Description de l'événement" 
            rows={4} 
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input 
              name="date" 
              value={form.date} 
              onChange={handleChange} 
              placeholder="2023-12-31" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Heure</label>
            <Input 
              name="time" 
              value={form.time} 
              onChange={handleChange} 
              placeholder="20:00" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <Input 
              name="location" 
              value={form.location} 
              onChange={handleChange} 
              placeholder="Bar Lounge" 
              required 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Texte du bouton</label>
            <Input 
              name="action_text" 
              value={form.action_text} 
              onChange={handleChange} 
              placeholder="Réserver" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lien du bouton</label>
            <Input 
              name="action_link" 
              value={form.action_link} 
              onChange={handleChange} 
              placeholder="/events/jazz-night" 
              required 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
          <Input 
            type="number"
            name="display_order" 
            value={form.display_order.toString()} 
            onChange={handleChange} 
            min={0}
            required 
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    );
  };

  const StoryForm = ({ story, onSave, onCancel }: { 
    story: HotelStory, 
    onSave: (story: HotelStory) => void, 
    onCancel: () => void 
  }) => {
    const [form, setForm] = useState<HotelStory>(story);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <Input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="Notre histoire" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <Input 
            name="image" 
            value={form.image} 
            onChange={handleChange} 
            placeholder="URL de l'image" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Contenu</label>
          <Textarea 
            name="content" 
            value={form.content} 
            onChange={handleChange} 
            placeholder="Contenu de la story" 
            rows={6} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
          <Input 
            type="number"
            name="display_order" 
            value={form.display_order.toString()} 
            onChange={handleChange} 
            min={0}
            required 
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    );
  };

  const AssistanceForm = ({ assistance, onSave, onCancel }: { 
    assistance: HotelAssistance, 
    onSave: (assistance: HotelAssistance) => void, 
    onCancel: () => void 
  }) => {
    const [form, setForm] = useState<HotelAssistance>(assistance);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <Input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="Besoin d'aide ?" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Notre équipe est disponible 24/7" 
            rows={4} 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Image d'arrière-plan</label>
          <Input 
            name="background_image" 
            value={form.background_image} 
            onChange={handleChange} 
            placeholder="URL de l'image" 
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Texte du bouton</label>
            <Input 
              name="action_text" 
              value={form.action_text} 
              onChange={handleChange} 
              placeholder="Contacter la réception" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lien du bouton</label>
            <Input 
              name="action_link" 
              value={form.action_link} 
              onChange={handleChange} 
              placeholder="/contact" 
              required 
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/hotels')}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold text-primary">
          {hotel ? `Interface: ${hotel.name}` : 'Interface de l\'hôtel'}
        </h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7">
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="hero">Héro</TabsTrigger>
          <TabsTrigger value="experiences">Expériences</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="assistance">Assistance</TabsTrigger>
        </TabsList>

        {/* Section À propos */}
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sections "À propos"</CardTitle>
                <CardDescription>Gérez les sections d'informations sur l'hôtel</CardDescription>
              </div>
              <Button 
                onClick={() => setEditingAbout({
                  id: '',
                  hotel_id: id || '',
                  title: '',
                  description: '',
                  icon: 'Info',
                  action_text: 'En savoir plus',
                  action_link: '/about',
                  status: 'active',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une section
              </Button>
            </CardHeader>
            <CardContent>
              {editingAbout ? (
                <AboutForm 
                  about={editingAbout} 
                  onSave={handleSaveAbout} 
                  onCancel={() => setEditingAbout(null)} 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aboutSections.length === 0 ? (
                    <p className="col-span-full text-center py-8 text-muted-foreground">
                      Aucune section trouvée. Cliquez sur "Ajouter une section" pour commencer.
                    </p>
                  ) : (
                    aboutSections.map(section => (
                      <Card key={section.id}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">{section.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingAbout(section)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Éditer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteAbout(section.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Services */}
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Services de l'hôtel</CardTitle>
                <CardDescription>Gérez les services proposés par l'hôtel</CardDescription>
              </div>
              <Button 
                onClick={() => setEditingService({
                  id: '',
                  hotel_id: id || '',
                  title: '',
                  description: '',
                  icon: 'Utensils',
                  action_text: 'En savoir plus',
                  action_link: '/services',
                  status: 'active',
                  type: 'main',
                  display_order: services.length,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un service
              </Button>
            </CardHeader>
            <CardContent>
              {editingService ? (
                <ServiceForm 
                  service={editingService} 
                  onSave={handleSaveService} 
                  onCancel={() => setEditingService(null)} 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.length === 0 ? (
                    <p className="col-span-full text-center py-8 text-muted-foreground">
                      Aucun service trouvé. Cliquez sur "Ajouter un service" pour commencer.
                    </p>
                  ) : (
                    services.map(service => (
                      <Card key={service.id}>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Utensils className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                          </div>
                          <CardDescription>{service.type === 'main' ? 'Principal' : 'Additionnel'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">{service.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingService(service)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Éditer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Héro */}
        <TabsContent value="hero" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Section Héro</CardTitle>
                <CardDescription>Configurez la section d'accueil principale</CardDescription>
              </div>
              {!hero && !editingHero && (
                <Button 
                  onClick={() => setEditingHero({
                    ...defaultHotelHero,
                    hotel_id: id || '',
                  })}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Créer la section Héro
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingHero ? (
                <HeroForm 
                  hero={editingHero} 
                  onSave={handleSaveHero} 
                  onCancel={() => setEditingHero(null)} 
                />
              ) : hero ? (
                <div>
                  <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                    <img 
                      src={hero.background_image || '/placeholder.svg'} 
                      alt="Hero background" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-xl font-bold text-white">{hero.title}</h3>
                      <p className="text-white/80">{hero.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingHero(hero)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Éditer
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Aucune section Héro définie. Cliquez sur "Créer la section Héro" pour commencer.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Expériences */}
        <TabsContent value="experiences" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expériences</CardTitle>
                <CardDescription>Gérez les expériences proposées par l'hôtel</CardDescription>
              </div>
              <Button 
                onClick={() => setEditingExperience({
                  ...defaultHotelExperience,
                  hotel_id: id || '',
                  display_order: experiences.length,
                })}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une expérience
              </Button>
            </CardHeader>
            <CardContent>
              {editingExperience ? (
                <ExperienceForm 
                  experience={editingExperience} 
                  onSave={handleSaveExperience} 
                  onCancel={() => setEditingExperience(null)} 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {experiences.length === 0 ? (
                    <p className="col-span-full text-center py-8 text-muted-foreground">
                      Aucune expérience trouvée. Cliquez sur "Ajouter une expérience" pour commencer.
                    </p>
                  ) : (
                    experiences.map(experience => (
                      <Card key={experience.id}>
                        <div className="relative h-32 w-full">
                          <img 
                            src={experience.image || '/placeholder.svg'} 
                            alt={experience.title} 
                            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{experience.title}</CardTitle>
                          <CardDescription>{experience.subtitle}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{experience.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingExperience(experience)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Éditer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteExperience(experience.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Événements */}
        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Événements</CardTitle>
                <CardDescription>Gérez les événements de l'hôtel</CardDescription>
              </div>
              <Button 
                onClick={() => setEditingEvent({
                  ...defaultHotelEvent,
                  hotel_id: id || '',
                  display_order: events.length,
                })}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un événement
              </Button>
            </CardHeader>
            <CardContent>
              {editingEvent ? (
                <EventForm 
                  event={editingEvent} 
                  onSave={handleSaveEvent} 
                  onCancel={() => setEditingEvent(null)} 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.length === 0 ? (
                    <p className="col-span-full text-center py-8 text-muted-foreground">
                      Aucun événement trouvé. Cliquez sur "Ajouter un événement" pour commencer.
                    </p>
                  ) : (
                    events.map(event => (
                      <Card key={event.id}>
                        <div className="relative h-32 w-full">
                          <img 
                            src={event.image || '/placeholder.svg'} 
                            alt={event.title} 
                            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription>{event.date} - {event.time}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                          <p className="text-sm mt-2 font-medium">Lieu: {event.location}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingEvent(event)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Éditer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Stories */}
        <TabsContent value="stories" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stories</CardTitle>
                <CardDescription>Gérez les stories de l'hôtel</CardDescription>
              </div>
              <Button 
                onClick={() => setEditingStory({
                  ...defaultHotelStory,
                  hotel_id: id || '',
                  display_order: stories.length,
                })}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une story
              </Button>
            </CardHeader>
            <CardContent>
              {editingStory ? (
                <StoryForm 
                  story={editingStory} 
                  onSave={handleSaveStory} 
                  onCancel={() => setEditingStory(null)} 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stories.length === 0 ? (
                    <p className="col-span-full text-center py-8 text-muted-foreground">
                      Aucune story trouvée. Cliquez sur "Ajouter une story" pour commencer.
                    </p>
                  ) : (
                    stories.map(story => (
                      <Card key={story.id}>
                        <div className="relative h-32 w-full">
                          <img 
                            src={story.image || '/placeholder.svg'} 
                            alt={story.title} 
                            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{story.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3">{story.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingStory(story)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Éditer
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteStory(story.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Assistance */}
        <TabsContent value="assistance" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Section Assistance</CardTitle>
                <CardDescription>Configurez la section d'assistance</CardDescription>
              </div>
              {!assistance && !editingAssistance && (
                <Button 
                  onClick={() => setEditingAssistance({
                    ...defaultHotelAssistance,
                    hotel_id: id || '',
                  })}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Créer la section Assistance
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingAssistance ? (
                <AssistanceForm 
                  assistance={editingAssistance} 
                  onSave={handleSaveAssistance} 
                  onCancel={() => setEditingAssistance(null)} 
                />
              ) : assistance ? (
                <div>
                  <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                    <img 
                      src={assistance.background_image || '/placeholder.svg'} 
                      alt="Assistance background" 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-xl font-bold text-white">{assistance.title}</h3>
                      <p className="text-white/80">{assistance.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingAssistance(assistance)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Éditer
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Aucune section Assistance définie. Cliquez sur "Créer la section Assistance" pour commencer.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotelInterface;
