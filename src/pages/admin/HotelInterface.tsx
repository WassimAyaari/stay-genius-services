
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Info, Palette, Grid, Layout, Image, 
  Compass, Star, MessageSquare, Calendar, Film, ShoppingBag, 
  HeartHandshake, Utensils, PhoneCall, Sparkles, Clock, Map, Plus, Trash2, Edit, Eye, ExternalLink
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
              placeholder="Explorer" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lien du bouton</label>
            <Input 
              name="action_link" 
              value={form.action_link} 
              onChange={handleChange} 
              placeholder="/experiences/spa" 
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
              type="date"
              name="date" 
              value={form.date} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Heure</label>
            <Input 
              type="time"
              name="time" 
              value={form.time} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu</label>
            <Input 
              name="location" 
              value={form.location} 
              onChange={handleChange} 
              placeholder="Bar de l'hôtel" 
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Notre équipe est disponible 24/7 pour vous aider" 
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
              placeholder="Contacter" 
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

  // Add the render function here
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/admin/hotels')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{hotel?.name || 'Chargement...'}</h1>
        <Button 
          variant="external" 
          onClick={() => window.open(`/hotels/${id}`, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" /> Visualiser le site
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full justify-start overflow-auto">
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="hero">Section Héro</TabsTrigger>
          <TabsTrigger value="experiences">Expériences</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="assistance">Assistance</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Sections À propos</CardTitle>
              <CardDescription>
                Gérez les informations à propos de l'hôtel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingAbout ? (
                <AboutForm 
                  about={editingAbout} 
                  onSave={handleSaveAbout} 
                  onCancel={() => setEditingAbout(null)} 
                />
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button onClick={() => setEditingAbout({
                      id: '',
                      hotel_id: id || '',
                      title: '',
                      description: '',
                      icon: 'Info',
                      action_text: 'En savoir plus',
                      action_link: '/about',
                      status: 'active'
                    })}>
                      <Plus className="mr-2 h-4 w-4" /> Ajouter une section
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aboutSections.map((section) => (
                      <Card key={section.id}>
                        <CardHeader className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <Info className="h-5 w-5 mr-2" />
                              <CardTitle className="text-lg">{section.title}</CardTitle>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setEditingAbout(section)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteAbout(section.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {section.status}
                            </span>
                            <Button variant="link" size="sm" className="p-0 h-auto">
                              {section.action_text}
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

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Services de l'hôtel</CardTitle>
              <CardDescription>
                Gérez les services proposés par l'hôtel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingService ? (
                <ServiceForm 
                  service={editingService} 
                  onSave={handleSaveService} 
                  onCancel={() => setEditingService(null)} 
                />
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button onClick={() => setEditingService({
                      id: '',
                      hotel_id: id || '',
                      title: '',
                      description: '',
                      icon: 'Utensils',
                      action_text: 'Explorer',
                      action_link: '/services',
                      status: 'active',
                      type: 'main',
                      display_order: services.length
                    })}>
                      <Plus className="mr-2 h-4 w-4" /> Ajouter un service
                    </Button>
                  </div>

                  <h3 className="text-lg font-medium mb-2">Services principaux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {services
                      .filter(service => service.type === 'main')
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((service) => (
                        <Card key={service.id}>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Utensils className="h-5 w-5 mr-2" />
                                <CardTitle className="text-lg">{service.title}</CardTitle>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingService(service)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteService(service.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {service.status}
                              </span>
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                {service.action_text}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  <h3 className="text-lg font-medium mb-2">Services additionnels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services
                      .filter(service => service.type === 'additional')
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((service) => (
                        <Card key={service.id}>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Sparkles className="h-5 w-5 mr-2" />
                                <CardTitle className="text-lg">{service.title}</CardTitle>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingService(service)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteService(service.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {service.status}
                              </span>
                              <Button variant="link" size="sm" className="p-0 h-auto">
                                {service.action_text}
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

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Section Héro</CardTitle>
              <CardDescription>
                Configurez la section héro de la page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingHero ? (
                <HeroForm 
                  hero={editingHero} 
                  onSave={handleSaveHero} 
                  onCancel={() => setEditingHero(null)} 
                />
              ) : (
                <>
                  {hero ? (
                    <div className="rounded-lg overflow-hidden bg-gray-100 relative">
                      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${hero.background_image})` }}></div>
                      <div className="relative p-6 md:p-8 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{hero.title}</h2>
                        <p className="text-lg mb-4">{hero.subtitle}</p>
                        <div className="flex items-center justify-center bg-white rounded-lg py-2 px-4 border max-w-md mx-auto">
                          <span className="text-gray-400">{hero.search_placeholder}</span>
                        </div>
                        <div className="mt-4">
                          <Button onClick={() => setEditingHero(hero)}>
                            <Edit className="mr-2 h-4 w-4" /> Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">Aucune section héro configurée</p>
                      <Button onClick={() => setEditingHero({...defaultHotelHero, hotel_id: id || ''})}>
                        <Plus className="mr-2 h-4 w-4" /> Créer une section héro
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiences">
          <Card>
            <CardHeader>
              <CardTitle>Expériences</CardTitle>
              <CardDescription>
                Gérez les expériences proposées par l'hôtel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingExperience ? (
                <ExperienceForm 
                  experience={editingExperience} 
                  onSave={handleSaveExperience} 
                  onCancel={() => setEditingExperience(null)} 
                />
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button onClick={() => setEditingExperience({
                      ...defaultHotelExperience,
                      hotel_id: id || '',
                      display_order: experiences.length
                    })}>
                      <Plus className="mr-2 h-4 w-4" /> Ajouter une expérience
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {experiences
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((experience) => (
                        <Card key={experience.id} className="overflow-hidden">
                          <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${experience.image})` }}></div>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-xs text-blue-600 font-medium mb-1 block">{experience.category}</span>
                                <CardTitle className="text-lg">{experience.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{experience.subtitle}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingExperience(experience)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteExperience(experience.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground mb-2">{experience.description}</p>
                            <Button variant="outline" size="sm">
                              {experience.action_text}
                            </Button>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-between items-center">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {experience.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Ordre: {experience.display_order}
                            </span>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Événements</CardTitle>
              <CardDescription>
                Gérez les événements de l'hôtel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingEvent ? (
                <EventForm 
                  event={editingEvent} 
                  onSave={handleSaveEvent} 
                  onCancel={() => setEditingEvent(null)} 
                />
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button onClick={() => setEditingEvent({
                      ...defaultHotelEvent,
                      hotel_id: id || '',
                      display_order: events.length
                    })}>
                      <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((event) => (
                        <Card key={event.id} className="overflow-hidden">
                          <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }}></div>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{event.title}</CardTitle>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingEvent(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                {event.date}
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-1" />
                                {event.time}
                              </div>
                              <div className="flex items-center text-sm">
                                <Map className="h-4 w-4 mr-1" />
                                {event.location}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                            <Button variant="outline" size="sm">
                              {event.action_text}
                            </Button>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-between items-center">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {event.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Ordre: {event.display_order}
                            </span>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stories">
          <Card>
            <CardHeader>
              <CardTitle>Stories</CardTitle>
              <CardDescription>
                Gérez les stories de l'hôtel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingStory ? (
                <StoryForm 
                  story={editingStory} 
                  onSave={handleSaveStory} 
                  onCancel={() => setEditingStory(null)} 
                />
              ) : (
                <>
                  <div className="flex justify-end">
                    <Button onClick={() => setEditingStory({
                      ...defaultHotelStory,
                      hotel_id: id || '',
                      display_order: stories.length
                    })}>
                      <Plus className="mr-2 h-4 w-4" /> Ajouter une story
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stories
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((story) => (
                        <Card key={story.id} className="overflow-hidden">
                          <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${story.image})` }}></div>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{story.title}</CardTitle>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingStory(story)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteStory(story.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground">
                              {story.content.length > 100 
                                ? `${story.content.substring(0, 100)}...` 
                                : story.content}
                            </p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-between items-center">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {story.status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Ordre: {story.display_order}
                            </span>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistance">
          <Card>
            <CardHeader>
              <CardTitle>Section Assistance</CardTitle>
              <CardDescription>
                Configurez la section d'assistance de la page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingAssistance ? (
                <AssistanceForm 
                  assistance={editingAssistance} 
                  onSave={handleSaveAssistance} 
                  onCancel={() => setEditingAssistance(null)} 
                />
              ) : (
                <>
                  {assistance ? (
                    <div className="rounded-lg overflow-hidden bg-gray-100 relative">
                      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${assistance.background_image})` }}></div>
                      <div className="relative p-6 md:p-8 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{assistance.title}</h2>
                        <p className="text-lg mb-4">{assistance.description}</p>
                        <Button variant="secondary">
                          <PhoneCall className="mr-2 h-4 w-4" />
                          {assistance.action_text}
                        </Button>
                        <div className="mt-4">
                          <Button onClick={() => setEditingAssistance(assistance)}>
                            <Edit className="mr-2 h-4 w-4" /> Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">Aucune section d'assistance configurée</p>
                      <Button onClick={() => setEditingAssistance({...defaultHotelAssistance, hotel_id: id || ''})}>
                        <Plus className="mr-2 h-4 w-4" /> Créer une section d'assistance
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HotelInterface;
