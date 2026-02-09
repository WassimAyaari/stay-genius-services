import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, ArrowRight, Heart } from 'lucide-react';
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
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile & Loyalty
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Identity Section */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            IDENTITY
          </div>
          
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={guest.profile_image || undefined} alt={`${guest.first_name} ${guest.last_name}`} />
              <AvatarFallback className="text-sm bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {guest.first_name} {guest.last_name}
                </span>
              </div>
              
              {guest.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{guest.email}</span>
                </div>
              )}
              
              {guest.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{guest.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Account Activity Section */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            ACCOUNT ACTIVITY
          </div>
          
          {guest.created_at ? (
            <div className="flex items-center gap-2 text-sm">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span>First Login: {formatDate(guest.created_at)}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No activity recorded</p>
          )}
        </div>

        {/* Companions (if any) */}
        {companions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                COMPANIONS ({companions.length})
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

        <Separator />

        {/* Loyalty Section */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            LOYALTY
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Membership Number:</span>
              <span>—</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="ml-6 text-muted-foreground">Membership Level:</span>
              <span>—</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestProfileCard;
