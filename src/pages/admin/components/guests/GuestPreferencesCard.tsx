import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Plus, Bed, Utensils, ConciergeBell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GuestPreferencesCardProps {
  guestId: string;
}

const categoryConfig = [
  { id: 'room', label: 'ROOM', icon: Bed },
  { id: 'dining', label: 'DINING', icon: Utensils },
  { id: 'service', label: 'SERVICE', icon: ConciergeBell },
];

const GuestPreferencesCard: React.FC<GuestPreferencesCardProps> = ({ guestId }) => {
  const { data: preferences = [] } = useQuery({
    queryKey: ['admin-guest-preferences', guestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_preferences')
        .select('*')
        .eq('guest_id', guestId);
      if (error) throw error;
      return data as { id: string; category: string; value: string }[];
    },
    enabled: !!guestId,
  });

  const grouped = preferences.reduce<Record<string, string[]>>((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p.value);
    return acc;
  }, {});

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
        {categoryConfig.map((category, index) => {
          const Icon = category.icon;
          const prefs = grouped[category.id] || [];
          return (
            <React.Fragment key={category.id}>
              {index > 0 && <Separator />}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  <Icon className="h-3.5 w-3.5" />
                  {category.label}
                </div>
                {prefs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {prefs.map((pref, i) => (
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
