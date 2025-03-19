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
  HotelStory, HotelAssistance, Hotel as HotelType,
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

  // ... rest of the code remains unchanged

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
