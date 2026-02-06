
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import EventReservationForm from '@/components/events/EventReservationForm';
import { EventReservation } from '@/types/event';

interface EventBookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  onSuccess: () => void;
  buttonText?: string;
  existingReservation?: EventReservation;
  maxGuests?: number;
}

const EventBookingDialog = ({ 
  isOpen, 
  onOpenChange, 
  eventId, 
  eventTitle,
  eventDate,
  onSuccess,
  buttonText,
  existingReservation,
  maxGuests
}: EventBookingDialogProps) => {
  const isEditing = !!existingReservation;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 max-h-[90vh]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {isEditing ? `Edit your reservation - ${eventTitle}` : `Book - ${eventTitle}`}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Edit the details of your reservation below."
              : "Fill out the form below to reserve your spot at this event."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="p-6 pt-2">
            {eventId && (
              <EventReservationForm 
                eventId={eventId}
                eventDate={eventDate}
                onSuccess={onSuccess}
                buttonText={buttonText || (isEditing ? "Update Reservation" : "Book")}
                existingReservation={existingReservation}
                maxGuests={maxGuests}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EventBookingDialog;
