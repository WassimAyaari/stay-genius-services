
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import EventReservationForm from './EventReservationForm';
import { Event } from '@/types/event';

interface EventReservationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onSuccess: () => void;
  buttonText?: string;
}

const EventReservationDialog: React.FC<EventReservationDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
  onSuccess,
  buttonText
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            Réserver pour {event.title}
          </DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour réserver votre place pour cet événement.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 pt-2">
            <EventReservationForm 
              event={event} 
              onSuccess={onSuccess}
              buttonText={buttonText}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EventReservationDialog;
