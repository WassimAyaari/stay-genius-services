
import React from 'react';
import { Event } from '@/types/event';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface EventTableProps {
  events: Event[];
  selectedEventId: string | undefined;
  onSelectEvent: (eventId: string) => void;
}

export const EventTable: React.FC<EventTableProps> = ({ 
  events, 
  selectedEventId, 
  onSelectEvent 
}) => {
  const limitedEvents = events.slice(0, 5);
  
  return (
    <ScrollArea className="h-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Événement</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {limitedEvents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                Aucun événement disponible
              </TableCell>
            </TableRow>
          ) : (
            limitedEvents.map((event: Event) => (
              <TableRow key={event.id} className={selectedEventId === event.id ? "bg-muted" : ""}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{format(new Date(event.date), 'dd MMM yyyy', { locale: fr })}</TableCell>
                <TableCell>{event.category === 'event' ? 'Événement' : 'Promotion'}</TableCell>
                <TableCell>
                  <Button 
                    variant={selectedEventId === event.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectEvent(event.id)}
                    className="flex items-center gap-1"
                  >
                    <Calendar className="h-4 w-4" />
                    {selectedEventId === event.id ? 'Sélectionné' : 'Voir réservations'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
