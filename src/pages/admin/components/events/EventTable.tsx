
import React from 'react';
import { Event } from '@/types/event';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Users, Star, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EventTableProps {
  events: Event[];
  selectedEventId: string | undefined;
  onSelectEvent: (eventId: string) => void;
  stories: { id: string; title: string; eventId?: string }[];
  isCollapsed?: boolean;
}

export const EventTable: React.FC<EventTableProps> = ({ 
  events, 
  selectedEventId, 
  onSelectEvent,
  stories = [],
  isCollapsed = false
}) => {
  // Créer un Map des événements qui sont liés à des stories
  const eventInStoryMap = new Map(
    stories
      .filter(story => story.eventId)
      .map(story => [story.eventId, story.title])
  );

  if (isCollapsed) {
    return (
      <ScrollArea className="h-[calc(100vh-170px)]">
        <div className="space-y-2 p-2">
          {events.map((event: Event) => (
            <TooltipProvider key={event.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedEventId === event.id ? "default" : "ghost"}
                    size="icon"
                    onClick={() => onSelectEvent(event.id)}
                    className="w-full h-12 relative"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    </div>
                    {event.is_featured && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"></span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.date), 'dd MMM yyyy', { locale: fr })}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-170px)]">
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
              <TableRow key={event.id} className={selectedEventId === event.id ? "bg-blue-50" : ""}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 shadow-sm border">
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
                          <Badge variant="default" className="text-xs bg-amber-500 hover:bg-amber-600">
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
                    <div className="text-xs text-muted-foreground mt-1 ml-6">{event.time}</div>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant={selectedEventId === event.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelectEvent(event.id)}
                    className={`flex items-center gap-1 w-full justify-center ${
                      selectedEventId === event.id ? "bg-blue-600 hover:bg-blue-700" : ""
                    }`}
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
  );
};
