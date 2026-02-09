import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Shield,
  AlertTriangle, 
  StickyNote, 
  Plus,
  Bell
} from 'lucide-react';
import { Guest } from './types';

interface GuestIntelligenceCardProps {
  guest: Guest;
}

const GuestIntelligenceCard: React.FC<GuestIntelligenceCardProps> = ({ guest }) => {
  const isHighValueGuest = guest.guest_type === 'Premium Guest' || guest.guest_type === 'VIP';
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Intelligence & Alerts
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Bell className="h-3.5 w-3.5 mr-1" />
              Alert
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <StickyNote className="h-3.5 w-3.5 mr-1" />
              Note
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Active Alerts Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <AlertTriangle className="h-3.5 w-3.5" />
            ACTIVE ALERTS
          </div>
          
          {/* Placeholder for allergies - will come from guest_allergies table */}
          <p className="text-sm text-muted-foreground italic">
            No active alerts
          </p>

          {/* Guest Value Badges */}
          {(isHighValueGuest || guest.guest_type) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {isHighValueGuest && (
                <Badge className="bg-primary text-primary-foreground">
                  HIGH-VALUE GUEST
                </Badge>
              )}
              {guest.guest_type && (
                <Badge variant="secondary">
                  {guest.guest_type}
                </Badge>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Staff Notes Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <StickyNote className="h-3.5 w-3.5" />
            STAFF-TO-STAFF NOTES
          </div>
          
          {/* Placeholder notes area - will come from guest_notes table */}
          <p className="text-sm text-muted-foreground italic">
            No notes
          </p>
          
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add a note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestIntelligenceCard;
