import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Info, Palette, Grid, Layout, Trash2, Edit, Eye, Image } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from "@/integrations/supabase/client";
import { useActiveHotel } from '@/hooks/useActiveHotel';
import { Separator } from '@/components/ui/separator';
import HotelPreview from '@/components/admin/HotelPreview';

interface Hotel {
  id: string;
  name: string;
}

interface HotelAbout {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  icon: string;
  action_text: string;
  action_link: string;
  status: string;
}

interface HotelService {
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

const HotelInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { hotel, aboutSections, services, loading: dataLoading } = useActiveHotel(id);
  const [editingAbout, setEditingAbout] = useState<HotelAbout | null>(null);
  const [editingService, setEditingService] = useState<HotelService | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  useEffect(() => {
    const fetchHotelSettings = async () => {
      if (id) {
        try {
        } catch (error) {
          console.error('Error fetching hotel settings:', error);
        }
      }
    };
    
    fetchHotelSettings();
  }, [id]);

  const handleSaveAbout = async (about: HotelAbout) => {
    setLoading(true);
    try {
      if (about.id) {
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
        
        toast.success('Section À propos mise à jour');
      } else {
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
        
        toast.success('Section À propos ajoutée');
      }
      
      setEditingAbout(null);
      setTimeout(() => {
        window.location.reload();
      }, 500);
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
        
        toast.success('Service mis à jour');
      } else {
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
        
        toast.success('Service ajouté');
      }
      
      setEditingService(null);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error("Erreur lors de l'enregistrement du service");
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
      
      toast.success('Section supprimée');
      setTimeout(() => {
        window.location.reload();
      }, 500);
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
      
      toast.success('Service supprimé');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Erreur lors de la suppression du service");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBackgroundImage = async (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    toast.success('Arrière-plan mis à jour');
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
              placeholder="history" 
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
              placeholder="utensils" 
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

  const newAboutTemplate: HotelAbout = {
    id: '',
    hotel_id: id || '',
    title: '',
    description: '',
    icon: 'info',
    action_text: 'En savoir plus',
    action_link: '/about',
    status: 'active'
  };

  const newServiceTemplate: HotelService = {
    id: '',
    hotel_id: id || '',
    title: '',
    description: '',
    icon: 'utensils',
    action_text: 'Découvrir',
    action_link: '/services',
    status: 'active',
    type: 'main',
    display_order: services.length
  };

  if (!hotel && !dataLoading) {
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
            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {isPreviewExpanded ? "Réduire l'aperçu" : "Agrandir l'aperçu"}
          </Button>
          
          <Button asChild>
            <Link to="/" target="_blank">Voir le site</Link>
          </Button>
        </div>
      </div>
      
      {dataLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className={isPreviewExpanded ? "col-span-full order-first" : "lg:col-span-1 order-last lg:order-first"}>
            <HotelPreview 
              hotelName={hotel?.name || ''}
              hotelAddress={hotel?.address || ''}
              aboutSections={aboutSections}
              backgroundImage={backgroundImage}
              className="sticky top-20"
            />
          </div>
          
          <div className={isPreviewExpanded ? "col-span-full" : "lg:col-span-2"}>
            <Tabs defaultValue="about">
              <TabsList className="mb-6">
                <TabsTrigger value="about" className="gap-2">
                  <Info className="w-4 h-4" />
                  Sections À propos
                </TabsTrigger>
                <TabsTrigger value="services" className="gap-2">
                  <Grid className="w-4 h-4" />
                  Services
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
                          {aboutSections.map((section) => (
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
                                    <Edit className="w-4 h-4 mr-1" /> Modifier
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => handleDeleteAbout(section.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" /> Supprimer
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
                                  <Badge className="mr-1">
                                    {service.type === 'main' ? 'Principal' : 'Additionnel'}
                                  </Badge>
                                  <Badge variant="outline">
                                    Ordre: {service.display_order}
                                  </Badge>
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
                                    <Edit className="w-4 h-4 mr-1" /> Modifier
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => handleDeleteService(service.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" /> Supprimer
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
              
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                    <CardDescription>
                      Personnalisez l'apparence visuelle de votre site d'hôtel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Image d'arrière-plan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {[
                            '/lovable-uploads/298d1ba4-d372-413d-9386-a531958ccd9c.png',
                            '/lovable-uploads/044dc763-e0b0-462e-8c6e-788f35efcd0c.png',
                            '/lovable-uploads/3cbdcf79-9da5-48bd-90f2-2c1737b76741.png',
                            '/lovable-uploads/ad4ef1bb-ac95-4aaf-87df-6e874d0fcf46.png'
                          ].map((img, index) => (
                            <div 
                              key={index} 
                              className={`relative cursor-pointer rounded-lg overflow-hidden h-40 ${
                                backgroundImage === img ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleUpdateBackgroundImage(img)}
                            >
                              <img 
                                src={img} 
                                alt={`Background ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                              {backgroundImage === img && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <div className="bg-white rounded-full p-1">
                                    <Image className="w-6 h-6 text-primary" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="text-center py-6">
                        <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg text-gray-500">D'autres options de personnalisation seront bientôt disponibles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
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
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelInterface;
