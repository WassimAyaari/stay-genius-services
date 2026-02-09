import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Edit, Plus } from 'lucide-react';

interface GuestPreferencesCardProps {
  guestId: string;
}

// Placeholder preferences - in the future these will come from guest_preferences table
const placeholderPreferences: string[] = [];

const GuestPreferencesCard: React.FC<GuestPreferencesCardProps> = ({ guestId }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Preferences (The DNA)
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {placeholderPreferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {placeholderPreferences.map((preference, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20 cursor-default"
              >
                {preference}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="text-sm text-muted-foreground">
              No preferences recorded yet
            </div>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add First Preference
            </Button>
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground italic">
            Staff can add preferences learned during conversations or service interactions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestPreferencesCard;
