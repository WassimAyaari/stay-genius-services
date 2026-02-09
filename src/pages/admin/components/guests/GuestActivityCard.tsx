import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ClipboardList, 
  Utensils, 
  AlertCircle,
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
  if (!dateString) return '';
  return format(new Date(dateString), 'dd MMM yyyy');
};

const EmptyState = ({ message }: { message: string }) => (
  <p className="text-sm text-muted-foreground italic">{message}</p>
);

const GuestActivityCard: React.FC<GuestActivityCardProps> = ({
  serviceRequests,
  tableReservations,
  spaBookings,
  eventReservations,
}) => {
  // Combine dining reservations (table + spa + events for F&B context)
  const allDiningReservations = [...tableReservations];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Activity & Memory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Service Requests Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <ClipboardList className="h-3.5 w-3.5" />
            SERVICE REQUESTS
          </div>
          {serviceRequests.length === 0 ? (
            <EmptyState message="No requests recorded" />
          ) : (
            <div className="space-y-2">
              {serviceRequests.slice(0, 5).map((request) => (
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
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    {getStatusBadge(request.status)}
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatActivityDate(request.created_at)}
                    </span>
                  </div>
                </div>
              ))}
              {serviceRequests.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{serviceRequests.length - 5} more requests
                </p>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Dining Reservations Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Utensils className="h-3.5 w-3.5" />
            DINING RESERVATIONS
          </div>
          {allDiningReservations.length === 0 ? (
            <EmptyState message="No reservations recorded" />
          ) : (
            <div className="space-y-2">
              {allDiningReservations.slice(0, 5).map((reservation) => (
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
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
              ))}
              {allDiningReservations.length > 5 && (
                <p className="text-xs text-muted-foreground">
                  +{allDiningReservations.length - 5} more reservations
                </p>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Previous Issues Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <AlertCircle className="h-3.5 w-3.5" />
            PREVIOUS ISSUES
          </div>
          <EmptyState message="No complaints" />
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestActivityCard;
