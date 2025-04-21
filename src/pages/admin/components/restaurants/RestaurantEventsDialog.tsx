
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EventForm from '@/pages/admin/components/events/EventForm';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types/event';
import { toast } from 'sonner';

interface RestaurantEventsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: any;
  event?: Event;
}

const RestaurantEventsDialog = ({ isOpen, onOpenChange, restaurant, event }: RestaurantEventsDialogProps) => {
  const { createEvent, updateEvent } = useEvents();

  const handleSubmit = async (data: Partial<Event>) => {
    try {
      if (event) {
        await updateEvent(event.id, { ...data, restaurant_id: restaurant.id });
        toast.success("Événement mis à jour avec succès");
      } else {
        await createEvent({ ...data, restaurant_id: restaurant.id });
        toast.success("Événement créé avec succès");
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error("Une erreur s'est produite");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {event ? "Modifier l'événement" : "Créer un événement"}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          initialData={event || { restaurant_id: restaurant?.id }}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantEventsDialog;
