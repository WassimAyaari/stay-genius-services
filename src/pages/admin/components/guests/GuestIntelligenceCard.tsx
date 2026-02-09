import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Star, 
  StickyNote, 
  Shield,
  Plus
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
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Intelligence & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Medical Alerts Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Medical Alerts
          </div>
          
          {/* Placeholder for allergies - will come from guest_allergies table */}
          <div className="text-sm text-muted-foreground italic p-3 bg-muted/50 rounded-lg">
            No medical alerts recorded
          </div>
          
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Medical Alert
          </Button>
        </div>

        <Separator />

        {/* Guest Value Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Star className="h-4 w-4 text-yellow-500" />
            Guest Value
          </div>
          
          <div className="flex flex-wrap gap-2">
            {isHighValueGuest && (
              <Badge className="bg-primary text-primary-foreground">
                <Star className="h-3 w-3 mr-1" />
                HIGH-VALUE GUEST
              </Badge>
            )}
            
            {guest.guest_type && (
              <Badge variant="secondary">
                {guest.guest_type}
              </Badge>
            )}
            
            {!isHighValueGuest && !guest.guest_type && (
              <span className="text-sm text-muted-foreground italic">
                Standard guest
              </span>
            )}
          </div>
        </div>

        <Separator />

        {/* Staff Notes Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <StickyNote className="h-4 w-4 text-amber-500" />
              Staff Notes
            </div>
          </div>
          
          {/* Placeholder notes area - will come from guest_notes table */}
          <div className="bg-muted border border-border rounded-lg p-3 space-y-2">
            <p className="text-sm text-muted-foreground italic">
              No staff notes yet. Add notes about guest preferences or important information.
            </p>
          </div>
          
          <div className="space-y-2">
            <Textarea 
              placeholder="Add a note about this guest..."
              className="min-h-[60px] text-sm resize-none"
            />
            <Button size="sm" className="h-8">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Save Note
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestIntelligenceCard;
