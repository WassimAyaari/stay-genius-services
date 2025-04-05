
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Star, StarOff } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types/event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EventForm from '@/pages/admin/components/events/EventForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export const EventsTab = () => {
  const { events, loading: eventsLoading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
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
    await updateEvent(event.id, {
      is_featured: !event.is_featured
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Liste des événements</h2>
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
              <EventForm onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} initialData={editingEvent} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="flex-1 overflow-hidden">
        {eventsLoading ? <div className="p-6 text-center">Chargement des événements...</div> : 
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mise en avant</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? 
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Aucun événement trouvé
                    </TableCell>
                  </TableRow> 
                : 
                  events.slice(0, 5).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.category === 'event' ? 'Événement' : 'Promotion'}</TableCell>
                      <TableCell>{format(new Date(event.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleFeature(event)}>
                          {event.is_featured ? 
                            <Star className="h-4 w-4 text-yellow-500 mr-2" /> : 
                            <StarOff className="h-4 w-4 mr-2" />
                          }
                          {event.is_featured ? 'Mise en avant' : 'Standard'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
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
                                  Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteEvent(event.id)} className="bg-red-500 hover:bg-red-600">
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            {events.length > 5 && (
              <div className="p-4 text-center">
                <Button variant="link">Voir tous les événements ({events.length})</Button>
              </div>
            )}
          </ScrollArea>
        }
      </Card>
    </>
  );
};
