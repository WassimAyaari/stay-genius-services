
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { supabase } from "@/integrations/supabase/client";
import { 
  HotelAbout, HotelService, HotelHero, HotelExperience, 
  HotelEvent, HotelStory, HotelAssistance, Hotel,
  defaultHotelHero, defaultHotelExperience, defaultHotelEvent,
  defaultHotelStory, defaultHotelAssistance  
} from '@/lib/types';

interface HotelData {
  id: string;
  name: string;
}

// About Form Component
const AboutForm = ({ about, onSave, onCancel }: { 
  about: HotelAbout, 
  onSave: (data: HotelAbout) => void, 
  onCancel: () => void 
}) => {
  const [formData, setFormData] = useState<HotelAbout>(about);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon">Icône</Label>
          <Select 
            name="icon" 
            value={formData.icon} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une icône" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Info">Info</SelectItem>
              <SelectItem value="Compass">Compass</SelectItem>
              <SelectItem value="Star">Star</SelectItem>
              <SelectItem value="Heart">Heart</SelectItem>
              <SelectItem value="MessageSquare">MessageSquare</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_text">Texte du bouton</Label>
          <Input 
            id="action_text" 
            name="action_text" 
            value={formData.action_text} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_link">Lien du bouton</Label>
          <Input 
            id="action_link" 
            name="action_link" 
            value={formData.action_link} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

// Service Form Component
const ServiceForm = ({ service, onSave, onCancel }: {
  service: HotelService,
  onSave: (data: HotelService) => void,
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<HotelService>(service);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon">Icône</Label>
          <Select 
            name="icon" 
            value={formData.icon} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une icône" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Utensils">Utensils</SelectItem>
              <SelectItem value="Sparkles">Sparkles</SelectItem>
              <SelectItem value="PhoneCall">PhoneCall</SelectItem>
              <SelectItem value="HeartHandshake">HeartHandshake</SelectItem>
              <SelectItem value="ShoppingBag">ShoppingBag</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select 
            name="type" 
            value={formData.type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Principal</SelectItem>
              <SelectItem value="additional">Additionnel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_text">Texte du bouton</Label>
          <Input 
            id="action_text" 
            name="action_text" 
            value={formData.action_text} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_link">Lien du bouton</Label>
          <Input 
            id="action_link" 
            name="action_link" 
            value={formData.action_link} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="display_order">Ordre d'affichage</Label>
          <Input 
            id="display_order" 
            name="display_order" 
            type="number" 
            value={formData.display_order} 
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

// Hero Form Component
const HeroForm = ({ hero, onSave, onCancel }: {
  hero: HotelHero,
  onSave: (data: HotelHero) => void,
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<HotelHero>(hero);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Sous-titre</Label>
          <Input 
            id="subtitle" 
            name="subtitle" 
            value={formData.subtitle} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="search_placeholder">Texte du placeholder de recherche</Label>
          <Input 
            id="search_placeholder" 
            name="search_placeholder" 
            value={formData.search_placeholder} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="background_image">URL de l'image de fond</Label>
          <Input 
            id="background_image" 
            name="background_image" 
            value={formData.background_image} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

// Experience Form Component
const ExperienceForm = ({ experience, onSave, onCancel }: {
  experience: HotelExperience,
  onSave: (data: HotelExperience) => void,
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<HotelExperience>(experience);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Sous-titre</Label>
          <Input 
            id="subtitle" 
            name="subtitle" 
            value={formData.subtitle} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Input 
            id="category" 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">URL de l'image</Label>
          <Input 
            id="image" 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_text">Texte du bouton</Label>
          <Input 
            id="action_text" 
            name="action_text" 
            value={formData.action_text} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_link">Lien du bouton</Label>
          <Input 
            id="action_link" 
            name="action_link" 
            value={formData.action_link} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="display_order">Ordre d'affichage</Label>
          <Input 
            id="display_order" 
            name="display_order" 
            type="number" 
            value={formData.display_order} 
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

// Event Form Component
const EventForm = ({ event, onSave, onCancel }: {
  event: HotelEvent,
  onSave: (data: HotelEvent) => void,
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<HotelEvent>(event);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            name="date" 
            type="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Heure</Label>
          <Input 
            id="time" 
            name="time" 
            type="time" 
            value={formData.time} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Lieu</Label>
          <Input 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">URL de l'image</Label>
          <Input 
            id="image" 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_text">Texte du bouton</Label>
          <Input 
            id="action_text" 
            name="action_text" 
            value={formData.action_text} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_link">Lien du bouton</Label>
          <Input 
            id="action_link" 
            name="action_link" 
            value={formData.action_link} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="display_order">Ordre d'affichage</Label>
          <Input 
            id="display_order" 
            name="display_order" 
            type="number" 
            value={formData.display_order} 
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

// Story Form Component
const StoryForm = ({ story, onSave, onCancel }: {
  story: HotelStory,
  onSave: (data: HotelStory) => void,
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<HotelStory>(story);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Contenu</Label>
          <Textarea 
            id="content" 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            required 
            className="min-h-[150px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image">URL de l'image</Label>
          <Input 
            id="image" 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="display_order">Ordre d'affichage</Label>
          <Input 
            id="display_order" 
            name="display_order" 
            type="number" 
            value={formData.display_order} 
            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

// Assistance Form Component
const AssistanceForm = ({ assistance, onSave, onCancel }: {
  assistance: HotelAssistance,
  onSave: (data: HotelAssistance) => void,
  onCancel: () => void
}) => {
  const [formData, setFormData] = useState<HotelAssistance>(assistance);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="background_image">URL de l'image de fond</Label>
          <Input 
            id="background_image" 
            name="background_image" 
            value={formData.background_image} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_text">Texte du bouton</Label>
          <Input 
            id="action_text" 
            name="action_text" 
            value={formData.action_text} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="action_link">Lien du bouton</Label>
          <Input 
            id="action_link" 
            name="action_link" 
            value={formData.action_link} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            name="status" 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

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

  // Handlers for About sections
  const handleSaveAbout = async (data: HotelAbout) => {
    try {
      const isNewItem = !data.id;
      
      if (isNewItem) {
        const { data: newData, error } = await supabase
          .from('hotel_about')
          .insert([{ ...data, hotel_id: id }])
          .select()
          .single();
        
        if (error) throw error;
        
        setAboutSections(prev => [...prev, newData]);
        toast.success('Section ajoutée avec succès');
      } else {
        const { error } = await supabase
          .from('hotel_about')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
        
        setAboutSections(prev => prev.map(item => item.id === data.id ? data : item));
        toast.success('Section mise à jour avec succès');
      }
      
      setEditingAbout(null);
    } catch (error) {
      console.error('Error saving about section:', error);
      toast.error("Erreur lors de l'enregistrement de la section");
    }
  };
  
  const handleDeleteAbout = async (aboutId: string) => {
    try {
      const { error } = await supabase
        .from('hotel_about')
        .delete()
        .eq('id', aboutId);
      
      if (error) throw error;
      
      setAboutSections(prev => prev.filter(item => item.id !== aboutId));
      toast.success('Section supprimée avec succès');
    } catch (error) {
      console.error('Error deleting about section:', error);
      toast.error("Erreur lors de la suppression de la section");
    }
  };

  // Handlers for Services
  const handleSaveService = async (data: HotelService) => {
    try {
      const isNewItem = !data.id;
      
      if (isNewItem) {
        const { data: newData, error } = await supabase
          .from('hotel_services')
          .insert([{ ...data, hotel_id: id }])
          .select()
          .single();
        
        if (error) throw error;
        
        setServices(prev => [...prev, newData]);
        toast.success('Service ajouté avec succès');
      } else {
        const { error } = await supabase
          .from('hotel_services')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
        
        setServices(prev => prev.map(item => item.id === data.id ? data : item));
        toast.success('Service mis à jour avec succès');
      }
      
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error("Erreur lors de l'enregistrement du service");
    }
  };
  
  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('hotel_services')
        .delete()
        .eq('id', serviceId);
      
      if (error) throw error;
      
      setServices(prev => prev.filter(item => item.id !== serviceId));
      toast.success('Service supprimé avec succès');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Erreur lors de la suppression du service");
    }
  };

  // Handlers for Hero section
  const handleSaveHero = async (data: HotelHero) => {
    try {
      const isNewItem = !data.id;
      
      if (isNewItem) {
        const { data: newData, error } = await supabase
          .from('hotel_hero')
          .insert([{ ...data, hotel_id: id }])
          .select()
          .single();
        
        if (error) throw error;
        
        setHero(newData);
        toast.success('Section héro ajoutée avec succès');
      } else {
        const { error } = await supabase
          .from('hotel_hero')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
        
        setHero(data);
        toast.success('Section héro mise à jour avec succès');
      }
      
      setEditingHero(null);
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast.error("Erreur lors de l'enregistrement de la section héro");
    }
  };

  // Handlers for Experiences
  const handleSaveExperience = async (data: HotelExperience) => {
    try {
      const isNewItem = !data.id;
      
      if (isNewItem) {
        const { data: newData, error } = await supabase
          .from('hotel_experiences')
          .insert([{ ...data, hotel_id: id }])
          .select()
          .single();
        
        if (error) throw error;
        
        setExperiences(prev => [...prev, newData]);
        toast.success('Expérience ajoutée avec succès');
      } else {
        const { error } = await supabase
          .from('hotel_experiences')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
        
        setExperiences(prev => prev.map(item => item.id === data.id ? data : item));
        toast.success('Expérience mise à jour avec succès');
      }
      
      setEditingExperience(null);
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error("Erreur lors de l'enregistrement de l'expérience");
    }
  };
  
  const handleDeleteExperience = async (experienceId: string) => {
    try {
      const { error } = await supabase
        .from('hotel_experiences')
        .delete()
        .eq('id', experienceId);
      
      if (error) throw error;
      
      setExperiences(prev => prev.filter(item => item.id !== experienceId));
      toast.success('Expérience supprimée avec succès');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error("Erreur lors de la suppression de l'expérience");
    }
  };

  // Handlers for Events
  const handleSaveEvent = async (data: HotelEvent) => {
    try {
      const isNewItem = !data.id;
      
      if (isNewItem) {
        const { data: newData, error } = await supabase
          .from('hotel_events')
          .insert([{ ...data, hotel_id: id }])
          .select()
          .single();
        
        if (error) throw error;
        
        setEvents(prev => [...prev, newData]);
        toast.success('Événement ajouté avec succès');
      } else {
        const { error } = await supabase
          .from('hotel_events')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
        
        setEvents(prev => prev.map(item => item.id === data.id ? data : item));
        toast.success('Événement mis à jour avec succès');
      }
      
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error("Erreur lors de l'enregistrement de l'événement");
    }
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('hotel_events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      
      setEvents(prev => prev.filter(item => item.id !== eventId));
      toast.success('Événement supprimé avec succès');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("Erreur lors de la suppression de l'événement");
    }
  };

  // Handlers for Stories
  const handleSaveStory = async (data: HotelStory) => {
    try {
      const isNewItem = !data.id;
      
      if (isNewItem) {
        const { data: newData, error } = await supabase
          .from('hotel_stories')
          .insert([{ ...data, hotel_id: id }])
          .select()
          .single();
        
        if (error) throw error;
        
        setStories(prev => [...prev, newData]);
        toast.success('Story ajoutée avec succès');
      } else {
        const { error } = await supabase
          .from('hotel_stories')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
        
        setStories(prev => prev.map(item => item.id === data.id ? data : item));
        toast.success('Story mise à jour avec succès');
      }
      
      setEditingStory(null);
    } catch (error) {
      console.error('Error saving story:', error);
      toast.error("Erreur lors de l'enregistrement de la story");
    }
  };
  
  const handleDeleteStory = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from('hotel_stories')
        .delete()
        .eq('id', storyId);
      
      if (error) throw error;
      
      setStories(prev => prev.filter(item => item.id !== storyId));
      toast.success('Story supprimée avec succès');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error("Erreur lors de la suppression de la story");
    }
  };

  // Handlers for Assistance
  const handleSaveAssistance = async (data: HotelAssistance) => {
    try {
      const isNewItem = !data.id;
      
      if (isNewItem) {
        const { data: newData, error } = await supabase
          .from('hotel_assistance')
          .insert([{ ...data, hotel_id: id }])
          .select()
          .single();
        
        if (error) throw error;
        
        setAssistance(newData);
        toast.success("Section d'assistance ajoutée avec succès");
      } else {
        const { error } = await supabase
          .from('hotel_assistance')
          .update(data)
          .eq('id', data.id);
        
        if (error) throw error;
        
        setAssistance(data);
        toast.success("Section d'assistance mise à jour avec succès");
      }
      
      setEditingAssistance(null);
    } catch (error) {
      console.error('Error saving assistance section:', error);
      toast.error("Erreur lors de l'enregistrement de la section d'assistance");
    }
  };

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
