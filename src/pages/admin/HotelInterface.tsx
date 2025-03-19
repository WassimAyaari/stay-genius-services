
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Info, Palette, Grid, Layout, Image, 
  Compass, Star, MessageSquare, Calendar, Film, ShoppingBag, 
  HeartHandshake, Utensils, PhoneCall, Sparkles, Clock, Map
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from "@/integrations/supabase/client";
import { 
  HotelAbout, HotelService, HotelHero, HotelExperience, 
  HotelEvent, HotelStory, HotelAssistance, Hotel,
  defaultHotelHero, defaultHotelExperience, defaultHotelEvent,
  defaultHotelStory, defaultHotelAssistance  
} from '@/lib/types';

interface Hotel {
  id: string;
  name: string;
}

const HotelInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [hotel, setHotel] = useState<Hotel | null>(null);
  
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

  // Fonctions de sauvegarde pour chaque type de contenu
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

  // Fonctions de suppression pour chaque type de contenu
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

  // Composants de formulaire pour chaque type de contenu
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
            placeholder="Rechercher des services, activités ou commodités..." 
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
              placeholder="Expérience Spa" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sous-titre</label>
            <Input 
              name="subtitle" 
              value={form.subtitle} 
              onChange={handleChange} 
              placeholder="Détente et relaxation" 
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
            placeholder="Description de l'expérience" 
            rows={4} 
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <Input 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              placeholder="Bien-être" 
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
              placeholder="Explorer maintenant" 
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
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <Input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="Dégustation de vin" 
            required 
          />
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input 
              name="date" 
              value={form.date} 
              onChange={handleChange} 
              placeholder="2023-06-15" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Heure</label>
            <Input 
              name="time" 
              value={form.time} 
              onChange={handleChange} 
              placeholder="18:00" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <Input 
              name="location" 
              value={form.location} 
              onChange={handleChange} 
              placeholder="Cave à vin" 
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
              placeholder="/events/wine-tasting" 
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
            placeholder="Besoin d'assistance ?" 
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Notre équipe est disponible 24/7 pour répondre à vos besoins" 
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
              placeholder="Contactez-nous" 
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

  // Templates pour créer de nouveaux éléments
  const newAboutTemplate: HotelAbout = {
    id: '',
    hotel_id: id || '',
    title: '',
    description: '',
    icon: 'Info',
    action_text: 'En savoir plus',
    action_link: '/about',
    status: 'active'
  };

  const newServiceTemplate: HotelService = {
    id: '',
    hotel_id: id || '',
    title: '',
    description: '',
    icon: 'UtensilsCrossed',
    action_text: 'Découvrir',
    action_link: '/services',
    status: 'active',
    type: 'main',
    display_order: services.length
  };

  const newHeroTemplate: HotelHero = {
    id: '',
    hotel_id: id || '',
    background_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    title: 'Bienvenue à votre guide de séjour',
    subtitle: 'Découvrez le luxe et le confort',
    search_placeholder: 'Rechercher des services, activités ou commodités...',
    status: 'active'
  };

  const newExperienceTemplate: HotelExperience = {
    id: '',
    hotel_id: id || '',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    action_text: 'Explorer maintenant',
    action_link: '',
    category: '',
    display_order: experiences.length,
    status: 'active'
  };

  const newEventTemplate: HotelEvent = {
    id: '',
    hotel_id: id || '',
    title: '',
    description: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    location: '',
    action_text: 'Réserver',
    action_link: '',
    display_order: events.length,
    status: 'active'
  };

  const newStoryTemplate: HotelStory = {
    id: '',
    hotel_id: id || '',
    title: '',
    image: '',
    content: '',
    display_order: stories.length,
    status: 'active'
  };

  const newAssistanceTemplate: HotelAssistance = {
    id: '',
    hotel_id: id || '',
    title: 'Besoin d\'assistance ?',
    description: 'Notre équipe est disponible 24/7 pour répondre à vos besoins',
    action_text: 'Contactez-nous',
    action_link: '/contact',
    background_image: '',
    status: 'active'
  };

  // Affichage de la page si l'hôtel n'existe pas
  if (!hotel && !loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/hotels')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-primary">Hôtel non trouvé</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10">
              <Info className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-xl font-medium text-gray-500">Cet hôtel n'existe pas ou a été supprimé</p>
              <Button 
                onClick={() => navigate('/admin/hotels')} 
                className="mt-6"
              >
                Retour à la liste des hôtels
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/hotels')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">{hotel?.name || 'Chargement...'}</h1>
            <p className="text-muted-foreground">Configuration de l'interface</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/hotels/${id}/edit`)}
          >
            Éditer l'hôtel
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/${id}`)}
          >
            Prévisualiser
          </Button>
        </div>
      </div>
      
      {loading && !hotel ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="about" className="gap-2">
              <Info className="w-4 h-4" />
              Sections À propos
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Grid className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="hero" className="gap-2">
              <Image className="w-4 h-4" />
              Section Héro
            </TabsTrigger>
            <TabsTrigger value="experiences" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Expériences
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              Événements
            </TabsTrigger>
            <TabsTrigger value="stories" className="gap-2">
              <Film className="w-4 h-4" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="assistance" className="gap-2">
              <HeartHandshake className="w-4 h-4" />
              Assistance
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="layout" className="gap-2">
              <Layout className="w-4 h-4" />
              Mise en page
            </TabsTrigger>
          </TabsList>
          
          {/* Onglet À propos */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sections À propos</CardTitle>
                <CardDescription>
                  Gérez les sections d'informations qui apparaissent sur votre page d'accueil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {aboutSections.length === 0 && !editingAbout ? (
                  <div className="text-center py-6">
                    <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500 mb-4">Aucune section À propos pour le moment</p>
                    <Button onClick={() => setEditingAbout(newAboutTemplate)}>
                      Ajouter une section
                    </Button>
                  </div>
                ) : (
                  <>
                    {!editingAbout && (
                      <div className="mb-6">
                        <Button onClick={() => setEditingAbout(newAboutTemplate)}>
                          Ajouter une section
                        </Button>
                      </div>
                    )}
                    
                    {editingAbout ? (
                      <Card className="mb-6 border-primary">
                        <CardHeader>
                          <CardTitle>{editingAbout.id ? 'Modifier' : 'Ajouter'} une section</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AboutForm 
                            about={editingAbout} 
                            onSave={handleSaveAbout} 
                            onCancel={() => setEditingAbout(null)} 
                          />
                        </CardContent>
                      </Card>
                    ) : null}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {aboutSections.map(section => (
                        <Card key={section.id} className="overflow-hidden">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <span className="p-2 bg-primary/10 rounded">
                                <Info className="w-4 h-4 text-primary" />
                              </span>
                              {section.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{section.description}</p>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditingAbout(section)}
                              >
                                Modifier
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteAbout(section.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Services */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services de l'hôtel</CardTitle>
                <CardDescription>
                  Gérez les services proposés par votre hôtel qui apparaissent sur votre page d'accueil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 && !editingService ? (
                  <div className="text-center py-6">
                    <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500 mb-4">Aucun service pour le moment</p>
                    <Button onClick={() => setEditingService(newServiceTemplate)}>
                      Ajouter un service
                    </Button>
                  </div>
                ) : (
                  <>
                    {!editingService && (
                      <div className="mb-6">
                        <Button onClick={() => setEditingService(newServiceTemplate)}>
                          Ajouter un service
                        </Button>
                      </div>
                    )}
                    
                    {editingService ? (
                      <Card className="mb-6 border-primary">
                        <CardHeader>
                          <CardTitle>{editingService.id ? 'Modifier' : 'Ajouter'} un service</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ServiceForm 
                            service={editingService} 
                            onSave={handleSaveService} 
                            onCancel={() => setEditingService(null)} 
                          />
                        </CardContent>
                      </Card>
                    ) : null}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {services.map(service => (
                        <Card key={service.id} className="overflow-hidden">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <span className="p-2 bg-primary/10 rounded">
                                <Grid className="w-4 h-4 text-primary" />
                              </span>
                              {service.title}
                            </CardTitle>
                            <CardDescription>
                              Type: {service.type === 'main' ? 'Principal' : 'Additionnel'} (Ordre: {service.display_order})
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">{service.description}</p>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditingService(service)}
                              >
                                Modifier
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleDeleteService(service.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Hero */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Section Héro</CardTitle>
                <CardDescription>
                  Configurez la section principale en haut de votre page d'accueil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!hero && !editingHero ? (
                  <div className="text-center py-6">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500 mb-4">Aucune section Héro configurée</p>
                    <Button onClick={() => setEditingHero(newHeroTemplate)}>
                      Configurer la section Héro
                    </Button>
                  </div>
                ) : (
                  <>
                    {editingHero ? (
                      <Card className="mb-6 border-primary">
                        <CardHeader>
                          <CardTitle>{editingHero.id ? 'Modifier' : 'Ajouter'} la section Héro</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <HeroForm 
                            hero={editingHero} 
                            onSave={handleSaveHero} 
                            onCancel={() => setEditingHero(null)} 
                          />
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <span className="p-2 bg-primary/10 rounded">
                              <Image className="w-4 h-4 text-primary" />
                            </span>
                            Section Héro
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video relative overflow-hidden rounded-md mb-4">
                            <img 
                              src={hero?.background_image} 
                              alt="Hero background" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent flex flex-col justify-center px-6 text-white">
                              <h2 className="text-2xl font-bold">{hero?.title}</h2>
                              <p className="text-lg">{hero?.subtitle}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-4">
                            Placeholder de recherche: {hero?.search_placeholder}
                          </p>
                          <div className="flex justify-end">
                            <Button 
                              variant="outline"
                              onClick={() => setEditingHero(hero || newHeroTemplate)}
                            >
                              Modifier
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Expériences */}
          <TabsContent value="experiences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expériences</CardTitle>
                <CardDescription>
                  Gérez les expériences mises en avant sur votre page d'accueil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {experiences.length === 0 && !editingExperience ? (
                  <div className="text-center py-6">
                    <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500 mb-4">Aucune expérience pour le moment</p>
                    <Button onClick={() => setEditingExperience(newExperienceTemplate)}>
                      Ajouter une expérience
                    </Button>
                  </div>
                ) : (
                  <>
                    {!editingExperience && (
                      <div className="mb-6">
                        <Button onClick={() => setEditingExperience(newExperienceTemplate)}>
                          Ajouter une expérience
                        </Button>
                      </div>
                    )}
                    
                    {editingExperience ? (
                      <Card className="mb-6 border-primary">
                        <CardHeader>
                          <CardTitle>{editingExperience.id ? 'Modifier' : 'Ajouter'} une expérience</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ExperienceForm 
                            experience={editingExperience} 
                            onSave={handleSaveExperience} 
                            onCancel={() => setEditingExperience(null)} 
                          />
                        </CardContent>
                      </Card>
                    ) : null}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {experiences.map(experience => (
                        <Card key={experience.id} className="overflow-hidden">
                          <div className="aspect-video relative overflow-hidden">
                            <img 
                              src={experience.image} 
                              alt={experience.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent flex flex-col justify-center px-6 text-white">
                              <span className="text-sm font-medium mb-1">{experience.category}</span>
                              <h3 className="text-xl font-bold">{experience.title}</h3>
                              <p className="text-sm opacity-90">{experience.subtitle}</p>
                            </div>
                          </div>
                          <CardContent className="pt-4">
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{experience.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">Ordre: {experience.display_order}</span>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setEditingExperience(experience)}
                                >
                                  Modifier
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => handleDeleteExperience(experience.id)}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Événements */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Événements</CardTitle>
                <CardDescription>
                  Gérez les événements qui apparaissent dans la section "Temps forts d'aujourd'hui".
                </CardDescription>
              </CardHeader>
              <CardContent>
                {events.length === 0 && !editingEvent ? (
                  <div className="text-center py-6">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500 mb-4">Aucun événement pour le moment</p>
                    <Button onClick={() => setEditingEvent(newEventTemplate)}>
                      Ajouter un événement
                    </Button>
                  </div>
                ) : (
                  <>
                    {!editingEvent && (
                      <div className="mb-6">
                        <Button onClick={() => setEditingEvent(newEventTemplate)}>
                          Ajouter un événement
                        </Button>
                      </div>
                    )}
                    
                    {editingEvent ? (
                      <Card className="mb-6 border-primary">
                        <CardHeader>
                          <CardTitle>{editingEvent.id ? 'Modifier' : 'Ajouter'} un événement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <EventForm 
                            event={editingEvent} 
                            onSave={handleSaveEvent} 
                            onCancel={() => setEditingEvent(null)} 
                          />
                        </CardContent>
                      </Card>
                    ) : null}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.map(event => (
                        <Card key={event.id} className="overflow-hidden">
                          <div className="aspect-video relative overflow-hidden">
                            <img 
                              src={event.image} 
                              alt={event.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="pt-4">
                            <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <Clock className="w-4 h-4" />
                              <span>{event.date} - {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                              <Map className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">Ordre: {event.display_order}</span>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setEditingEvent(event)}
                                >
                                  Modifier
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Stories */}
          <TabsContent value="stories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stories</CardTitle>
                <CardDescription>
                  Gérez les stories de type Instagram pour votre hôtel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stories.length === 0 && !editingStory ? (
                  <div className="text-center py-6">
                    <Film className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500 mb-4">Aucune story pour le moment</p>
                    <Button onClick={() => setEditingStory(newStoryTemplate)}>
                      Ajouter une story
                    </Button>
                  </div>
                ) : (
                  <>
                    {!editingStory && (
                      <div className="mb-6">
                        <Button onClick={() => setEditingStory(newStoryTemplate)}>
                          Ajouter une story
                        </Button>
                      </div>
                    )}
                    
                    {editingStory ? (
                      <Card className="mb-6 border-primary">
                        <CardHeader>
                          <CardTitle>{editingStory.id ? 'Modifier' : 'Ajouter'} une story</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <StoryForm 
                            story={editingStory} 
                            onSave={handleSaveStory} 
                            onCancel={() => setEditingStory(null)} 
                          />
                        </CardContent>
                      </Card>
                    ) : null}
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {stories.map(story => (
                        <div key={story.id} className="flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full border-2 border-primary p-1 mb-2 overflow-hidden">
                            <img 
                              src={story.image} 
                              alt={story.title} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <h3 className="text-sm font-medium text-center mb-1">{story.title}</h3>
                          <div className="flex gap-1 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="p-1 h-8 w-8" 
                              onClick={() => setEditingStory(story)}
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="p-1 h-8 w-8"
                              onClick={() => handleDeleteStory(story.id)}
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Assistance */}
          <TabsContent value="assistance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Section Assistance</CardTitle>
                <CardDescription>
                  Configurez la bannière d'assistance qui apparaît en bas de votre page d'accueil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!assistance && !editingAssistance ? (
                  <div className="text-center py-6">
                    <HeartHandshake className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500 mb-4">Aucune section d'assistance configurée</p>
                    <Button onClick={() => setEditingAssistance(newAssistanceTemplate)}>
                      Configurer la section Assistance
                    </Button>
                  </div>
                ) : (
                  <>
                    {editingAssistance ? (
                      <Card className="mb-6 border-primary">
                        <CardHeader>
                          <CardTitle>{editingAssistance.id ? 'Modifier' : 'Ajouter'} la section Assistance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AssistanceForm 
                            assistance={editingAssistance} 
                            onSave={handleSaveAssistance} 
                            onCancel={() => setEditingAssistance(null)} 
                          />
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-0 overflow-hidden">
                          <div className="relative aspect-[3/1] overflow-hidden">
                            <img 
                              src={assistance.background_image || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} 
                              alt="Assistance background" 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center p-6 text-white">
                              <h2 className="text-2xl font-bold mb-2">{assistance.title}</h2>
                              <p className="text-lg mb-4">{assistance.description}</p>
                              <Button variant="outline" className="text-white border-white w-fit">
                                {assistance.action_text}
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 flex justify-end">
                            <Button 
                              variant="outline"
                              onClick={() => setEditingAssistance(assistance || newAssistanceTemplate)}
                            >
                              Modifier
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Apparence */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence visuelle de votre site d'hôtel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-500">Cette fonctionnalité sera bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Mise en page */}
          <TabsContent value="layout">
            <Card>
              <CardHeader>
                <CardTitle>Mise en page</CardTitle>
                <CardDescription>
                  Configurez la disposition des éléments sur votre site d'hôtel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-500">Cette fonctionnalité sera bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default HotelInterface;
