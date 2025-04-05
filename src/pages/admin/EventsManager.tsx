
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Edit, Trash, Star, Image, StarOff } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useStories } from '@/hooks/useStories';
import { Event, Story } from '@/types/event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EventForm from '@/pages/admin/components/events/EventForm';
import StoryForm from '@/pages/admin/components/events/StoryForm';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventReservationsTab } from './components/events/EventReservationsTab';

const EventsManager = () => {
  const { events, loading: eventsLoading, createEvent, updateEvent, deleteEvent } = useEvents();
  const { stories, loading: storiesLoading, createStory, updateStory, deleteStory } = useStories();
  
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

  const handleCreateEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    await createEvent(event);
    setIsEventDialogOpen(false);
  };

  const handleUpdateEvent = async (event: Partial<Event>) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, event);
      setEditingEvent(null);
      setIsEventDialogOpen(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleToggleFeature = async (event: Event) => {
    await updateEvent(event.id, { is_featured: !event.is_featured });
  };

  const handleCreateStory = async (story: Omit<Story, 'id' | 'created_at' | 'updated_at'>) => {
    await createStory(story);
    setIsStoryDialogOpen(false);
  };

  const handleUpdateStory = async (story: Partial<Story>) => {
    if (editingStory) {
      await updateStory(editingStory.id, story);
      setEditingStory(null);
      setIsStoryDialogOpen(false);
    }
  };

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setIsStoryDialogOpen(true);
  };

  const handleToggleActive = async (story: Story) => {
    await updateStory(story.id, { is_active: !story.is_active });
  };

  return (
    <Layout>
      <div className="container py-8 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <h1 className="text-2xl font-bold mb-6">Gestion des Événements et Promotions</h1>
        
        <Tabs defaultValue="events" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mb-6">
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Liste des événements et promotions</h2>
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingEvent(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un événement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? 'Modifier l\'événement' : 'Ajouter un événement'}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[70vh]">
                    <EventForm 
                      onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} 
                      initialData={editingEvent} 
                    />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card className="flex-1 overflow-hidden">
              {eventsLoading ? (
                <div className="p-6 text-center">Chargement des événements...</div>
              ) : (
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <div className="min-w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Titre</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Lieu</TableHead>
                          <TableHead>À la une</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              Aucun événement trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          events.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell>
                                <div className="h-12 w-12 rounded overflow-hidden">
                                  <img 
                                    src={event.image} 
                                    alt={event.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>{event.title}</TableCell>
                              <TableCell>{event.category === 'event' ? 'Événement' : 'Promotion'}</TableCell>
                              <TableCell>
                                {format(new Date(event.date), 'dd/MM/yyyy')}
                                {event.time && <div className="text-xs">{event.time}</div>}
                              </TableCell>
                              <TableCell>{event.location || '-'}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleToggleFeature(event)}
                                >
                                  {event.is_featured ? (
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  ) : (
                                    <StarOff className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setSelectedEventId(event.id);
                                      document.querySelector('[data-value="reservations"]')?.dispatchEvent(
                                        new MouseEvent('click', { bubbles: true })
                                      );
                                    }}
                                  >
                                    <Calendar className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => deleteEvent(event.id)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Supprimer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="flex-1 overflow-hidden flex flex-col">
            <EventReservationsTab eventId={selectedEventId} />
          </TabsContent>
          
          <TabsContent value="stories" className="flex-1 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Liste des stories</h2>
              <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingStory(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une story
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>{editingStory ? 'Modifier la story' : 'Ajouter une story'}</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[70vh]">
                    <StoryForm 
                      onSubmit={editingStory ? handleUpdateStory : handleCreateStory} 
                      initialData={editingStory} 
                    />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="flex-1 overflow-hidden">
              {storiesLoading ? (
                <div className="p-6 text-center">Chargement des stories...</div>
              ) : (
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <div className="min-w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Titre</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Créée le</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stories.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              Aucune story trouvée
                            </TableCell>
                          </TableRow>
                        ) : (
                          stories.map((story) => (
                            <TableRow key={story.id}>
                              <TableCell>
                                <div className="h-12 w-12 rounded-full overflow-hidden">
                                  <img 
                                    src={story.image} 
                                    alt={story.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>{story.title}</TableCell>
                              <TableCell>{story.category === 'event' ? 'Événement' : 'Promotion'}</TableCell>
                              <TableCell>{format(new Date(story.created_at), 'dd/MM/yyyy')}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleToggleActive(story)}
                                  className={story.is_active ? 'text-green-500' : 'text-gray-500'}
                                >
                                  {story.is_active ? 'Active' : 'Inactive'}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditStory(story)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Êtes-vous sûr de vouloir supprimer cette story ? Cette action est irréversible.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => deleteStory(story.id)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Supprimer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EventsManager;
