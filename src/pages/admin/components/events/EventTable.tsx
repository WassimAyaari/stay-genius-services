
import React from 'react';
import { Event } from '@/types/event';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
  return (
    <>
      <div className="p-4 border-b">
        <h3 className="font-medium">Événements disponibles</h3>
      </div>
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Événement</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Aucun événement disponible
                </TableCell>
              </TableRow>
            ) : (
              events.map((event: Event) => (
                <TableRow key={event.id} className={selectedEventId === event.id ? "bg-muted" : ""}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <Badge variant="outline" className="mt-1">
                          {event.category === 'event' ? 'Événement' : 'Promotion'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 opacity-70" />
                      {format(new Date(event.date), 'dd MMM yyyy', { locale: fr })}
                    </div>
                    {event.time && (
                      <div className="text-xs text-muted-foreground mt-1">{event.time}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant={selectedEventId === event.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSelectEvent(event.id)}
                      className="flex items-center gap-1 w-full justify-center"
                    >
                      <Users className="h-4 w-4" />
                      {selectedEventId === event.id ? 'Sélectionné' : 'Voir réservations'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};
