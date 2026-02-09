import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ClipboardList, 
  Utensils, 
  Sparkles, 
  Calendar,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ServiceRequest, TableReservation, SpaBooking, EventReservation } from './types';

interface GuestActivityCardProps {
  serviceRequests: ServiceRequest[];
  tableReservations: TableReservation[];
  spaBookings: SpaBooking[];
  eventReservations: EventReservation[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
  'in-progress': 'bg-purple-100 text-purple-800 border-purple-300',
};

const getStatusBadge = (status: string) => {
  return (
    <Badge 
      variant="outline" 
      className={`text-xs ${statusColors[status.toLowerCase()] || 'bg-muted text-muted-foreground'}`}
    >
      {status}
    </Badge>
  );
};

const formatActivityDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'MMM d, yyyy');
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-8 text-sm text-muted-foreground">
    {message}
  </div>
);

const GuestActivityCard: React.FC<GuestActivityCardProps> = ({
  serviceRequests,
  tableReservations,
  spaBookings,
  eventReservations,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Activity & Memory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-9">
            <TabsTrigger value="requests" className="text-xs">
              <ClipboardList className="h-3.5 w-3.5 mr-1" />
              Requests
              {serviceRequests.length > 0 && (
                <span className="ml-1 text-xs">({serviceRequests.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="dining" className="text-xs">
              <Utensils className="h-3.5 w-3.5 mr-1" />
              F&B
              {tableReservations.length > 0 && (
                <span className="ml-1 text-xs">({tableReservations.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="spa" className="text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Spa
              {spaBookings.length > 0 && (
                <span className="ml-1 text-xs">({spaBookings.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Events
              {eventReservations.length > 0 && (
                <span className="ml-1 text-xs">({eventReservations.length})</span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-3">
            <ScrollArea className="h-[200px]">
              {serviceRequests.length === 0 ? (
                <EmptyState message="No service requests" />
              ) : (
                <div className="space-y-2">
                  {serviceRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {request.type}
                        </p>
                        {request.description && (
                          <p className="text-xs text-muted-foreground truncate">
                            {request.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusBadge(request.status)}
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatActivityDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="dining" className="mt-3">
            <ScrollArea className="h-[200px]">
              {tableReservations.length === 0 ? (
                <EmptyState message="No dining reservations" />
              ) : (
                <div className="space-y-2">
                  {tableReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          Table for {reservation.guests}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reservation.date} at {reservation.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="spa" className="mt-3">
            <ScrollArea className="h-[200px]">
              {spaBookings.length === 0 ? (
                <EmptyState message="No spa bookings" />
              ) : (
                <div className="space-y-2">
                  {spaBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          Spa Booking
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="events" className="mt-3">
            <ScrollArea className="h-[200px]">
              {eventReservations.length === 0 ? (
                <EmptyState message="No event reservations" />
              ) : (
                <div className="space-y-2">
                  {eventReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          Event for {reservation.guests} guests
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reservation.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GuestActivityCard;
