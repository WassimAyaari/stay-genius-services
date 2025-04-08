
import React from 'react';
import { Event } from '@/types/event';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
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
  // Create a Map of events linked to stories
  const eventInStoryMap = new Map(
    stories
      .filter(story => story.eventId)
      .map(story => [story.eventId, story.title])
  );

  return (
    <div className="border rounded-md">
      <div className="p-4 border-b">
        <h3 className="font-medium">Events</h3>
      </div>
      
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
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No events available
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id} className={selectedEventId === event.id ? "bg-muted" : ""}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
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
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 opacity-70" />
                      {format(new Date(event.date), 'dd MMM yyyy', { locale: enUS })}
                    </div>
                    {event.time && (
                      <div className="text-xs text-muted-foreground mt-1">{event.time}</div>
                    )}
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
                      variant={selectedEventId === event.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSelectEvent(event.id)}
                      className="flex items-center gap-1"
                    >
                      <Users className="h-4 w-4" />
                      {selectedEventId === event.id ? 'Selected' : 'Reservations'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
