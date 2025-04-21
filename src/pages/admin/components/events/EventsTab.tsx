
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Star, StarOff } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types/event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EventForm from '@/pages/admin/components/events/EventForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { enUS } from 'date-fns/locale';

export const EventsTab = () => {
  const { events, loading: eventsLoading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Update: accept all fields including restaurant_id
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
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Events</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingEvent(null)} className="bg-[#00AEBB]">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
              </DialogHeader>
              <EventForm onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} initialData={editingEvent} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {eventsLoading ? (
        <div className="p-10 text-center">
          <p className="text-lg text-muted-foreground">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-10 text-center border rounded-md bg-gray-50">
          <p className="text-lg text-muted-foreground">
            {searchTerm ? 'No events found with these criteria' : 'No events found'}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden">
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-medium">{event.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {event.category === 'event' ? 'Event' : 'Promotion'}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.location || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{format(new Date(event.date), 'dd MMM yyyy', { locale: enUS })}</span>
                      {event.time && <span className="text-sm text-muted-foreground">{event.time}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.is_featured ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        <Star className="h-3 w-3 mr-1 fill-amber-500" />
                        Featured
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleToggleFeature(event)}
                      >
                        {event.is_featured ? 
                          <StarOff className="h-4 w-4" /> : 
                          <Star className="h-4 w-4" />
                        }
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditEvent(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Confirmation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this event? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteEvent(event.id)} 
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
