
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import { format } from 'date-fns';
import { Edit, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RestaurantEventsListProps {
  events: Event[];
  onEditEvent: (event: Event) => void;
  isLoading: boolean;
}

const RestaurantEventsList: React.FC<RestaurantEventsListProps> = ({
  events,
  onEditEvent,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        Loading events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No events found for this restaurant
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>
                <Badge>{event.category}</Badge>
              </TableCell>
              <TableCell>
                {format(new Date(event.date), 'dd/MM/yyyy')}
                {event.time && ` at ${event.time}`}
              </TableCell>
              <TableCell>{event.location || '-'}</TableCell>
              <TableCell>
                {event.is_featured ? (
                  <Badge variant="secondary">Featured</Badge>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditEvent(event)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RestaurantEventsList;
