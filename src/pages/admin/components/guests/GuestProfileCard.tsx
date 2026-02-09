import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, Globe, Users, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Guest, Companion } from './types';

interface GuestProfileCardProps {
  guest: Guest;
  companions: Companion[];
}

const GuestProfileCard: React.FC<GuestProfileCardProps> = ({ guest, companions }) => {
  const getInitials = () => {
    return `${guest.first_name?.[0] || ''}${guest.last_name?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User className="h-4 w-4" />
          Core Profile & Loyalty
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar and Name Section */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={guest.profile_image || undefined} alt={`${guest.first_name} ${guest.last_name}`} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold">
              {guest.first_name} {guest.last_name}
            </h3>
            
            {guest.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{guest.email}</span>
              </div>
            )}
            
            {guest.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{guest.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {guest.birth_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Born: </span>
                <span className="font-medium">{formatDate(guest.birth_date)}</span>
              </div>
            </div>
          )}
          
          {guest.nationality && (
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <div>
                <span className="text-muted-foreground">Nationality: </span>
                <span className="font-medium">{guest.nationality}</span>
              </div>
            </div>
          )}
        </div>

        {/* Guest Type Badge */}
        {guest.guest_type && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {guest.guest_type}
          </Badge>
        )}

        {/* Member Since */}
        {guest.created_at && (
          <div className="text-xs text-muted-foreground">
            Member since {formatDate(guest.created_at)}
          </div>
        )}

        {/* Companions Section */}
        {companions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                Companions ({companions.length})
              </div>
              <div className="space-y-1.5">
                {companions.map((companion) => (
                  <div key={companion.id} className="flex items-center justify-between text-sm bg-muted/50 rounded-md px-3 py-2">
                    <span className="font-medium">
                      {companion.first_name} {companion.last_name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {companion.relation}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Loyalty Placeholder */}
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Heart className="h-4 w-4" />
            Loyalty Program
          </div>
          <div className="text-sm text-muted-foreground italic">
            Loyalty information not available
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestProfileCard;
