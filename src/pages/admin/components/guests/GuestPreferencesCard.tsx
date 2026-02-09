import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Plus, Bed, Utensils, ConciergeBell } from 'lucide-react';

interface GuestPreferencesCardProps {
  guestId: string;
}

interface PreferenceCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  preferences: string[];
}

// Placeholder categories - in the future these will come from guest_preferences table
const preferenceCategories: PreferenceCategory[] = [
  {
    id: 'room',
    label: 'ROOM',
    icon: Bed,
    preferences: [],
  },
  {
    id: 'dining',
    label: 'DINING',
    icon: Utensils,
    preferences: [],
  },
  {
    id: 'service',
    label: 'SERVICE',
    icon: ConciergeBell,
    preferences: [],
  },
];

const GuestPreferencesCard: React.FC<GuestPreferencesCardProps> = ({ guestId }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Preferences (Guest DNA)
          </CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {preferenceCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <React.Fragment key={category.id}>
              {index > 0 && <Separator />}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <Icon className="h-3.5 w-3.5" />
                  {category.label}
                </div>
                {category.preferences.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {category.preferences.map((pref, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-full"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No preferences
                  </p>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default GuestPreferencesCard;
