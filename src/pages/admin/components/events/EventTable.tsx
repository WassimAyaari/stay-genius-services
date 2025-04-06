
import React from 'react';
import { Event } from '@/types/event';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Users, Star, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface EventTableProps {
  events: Event[];
  selectedEventId: string | undefined;
  onSelectEvent: (eventId: string) => void;
  stories: { id: string; title: string; eventId?: string }[];
}

export const EventTable: React.FC<EventTableProps> = ({ 
  events, 
  selectedEventId, 
  onSelectEvent,
  stories = []
}) => {
  // Créer un Map des événements qui sont liés à des stories
  const eventInStoryMap = new Map(
    stories
      .filter(story => story.eventId)
      .map(story => [story.eventId, story.title])
  );

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Événements disponibles</h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Événement</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.title}</span>
                        {event.is_featured && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {event.category === 'event' ? 'Événement' : 'Promotion'}
                        </Badge>
                        {eventInStoryMap.has(event.id) && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            En story
                          </Badge>
                        )}
                        {event.is_featured && (
                          <Badge variant="default" className="text-xs">
                            Mis en avant
                          </Badge>
                        )}
                      </div>
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
    </div>
  );
};
