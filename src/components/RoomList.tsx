
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Room } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Eye, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoomList = () => {
  const { toast } = useToast();
  
  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'available');
      
      if (error) throw error;
      return data as Room[];
    },
  });

  const handleBookRoom = async (roomId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            guest_id: user.id,
            room_id: roomId,
            check_in: new Date().toISOString(),
            check_out: new Date(Date.now() + 86400000).toISOString(),
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room booked successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-pulse text-gray-400">Loading rooms...</div>
    </div>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {rooms?.map((room) => (
        <Card 
          key={room.id} 
          className="min-w-[280px] p-4 snap-center animate-fade-in"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 text-secondary">
                  <Home className="w-5 h-5 text-primary" />
                  Room {room.room_number}
                </h3>
                <p className="text-sm text-gray-500">Floor {room.floor}</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Available
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4" />
              {room.type}
            </div>
            {room.view_type && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                {room.view_type} View
              </div>
            )}
            <Button 
              onClick={() => handleBookRoom(room.id)}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              Book Now
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RoomList;
