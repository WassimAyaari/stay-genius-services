
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EventForm from '@/pages/admin/components/events/EventForm';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/types/event';
import { toast } from 'sonner';

interface SpaEventsDialogProps {
  open: boolean;  // Changed from isOpen to open to match the prop being passed
  onOpenChange: (open: boolean) => void;
  facility: any;
  event?: Event;
}

const SpaEventsDialog = ({ open, onOpenChange, facility, event }: SpaEventsDialogProps) => {
  const { createEvent, updateEvent } = useEvents();

  const handleSubmit = async (data: Partial<Event>) => {
    try {
      if (event) {
        await updateEvent(event.id, { ...data, spa_facility_id: facility.id });
        toast.success("Événement mis à jour avec succès");
      } else {
        const eventData = {
          title: data.title || '',
          description: data.description || '',
          image: data.image || '',
          category: data.category || 'event',
          is_featured: data.is_featured || false,
          date: data.date || new Date().toISOString().split('T')[0],
          spa_facility_id: facility.id,
          location: data.location,
          time: data.time,
          capacity: data.capacity
        } as Omit<Event, 'id' | 'created_at' | 'updated_at'>;
        
        await createEvent(eventData);
        toast.success("Événement créé avec succès");
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error("Une erreur s'est produite");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {event ? "Modifier l'événement" : "Créer un événement"}
          </DialogTitle>
        </DialogHeader>
        <EventForm
          initialData={event || { spa_facility_id: facility?.id }}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SpaEventsDialog;
