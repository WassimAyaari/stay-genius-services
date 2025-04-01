
import React, { useState } from 'react';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserInfo } from '../hooks/useUserInfo';
import { useQueryClient } from '@tanstack/react-query';
import { toast as sonnerToast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CustomRequestFormProps {
  room: Room | null;
  onRequestSuccess: () => void;
}

const CustomRequestForm = ({ room, onRequestSuccess }: CustomRequestFormProps) => {
  const [customRequest, setCustomRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { getUserInfo } = useUserInfo(room);
  const queryClient = useQueryClient();

  const handleCustomRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequest.trim() || !room) return;
    
    setIsSubmitting(true);
    try {
      console.log('Submitting custom request:', customRequest);
      const userInfo = getUserInfo();
      
      // Submit the service request
      const result = await requestService(
        room.id, 
        'custom', 
        customRequest, 
        undefined, 
        undefined
      );
      
      setCustomRequest('');
      toast({
        title: "Requête personnalisée envoyée",
        description: "Votre requête personnalisée a été soumise.",
      });
      
      // Enhanced cache invalidation approach
      console.log('Invalidating caches after custom request submission');
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      
      // Force an immediate refresh with higher priority
      queryClient.fetchQuery({
        queryKey: ['serviceRequests'],
        queryFn: () => null,
        staleTime: 0
      });
      
      // Multiple invalidations to ensure data refreshes
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, 100);
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, 500);
      
      // Notify admin through Supabase realtime
      try {
        const notificationChannel = supabase.channel('request_submission_notification');
        notificationChannel.subscribe(status => {
          if (status === 'SUBSCRIBED') {
            notificationChannel.send({
              type: 'broadcast',
              event: 'request_submitted',
              payload: { 
                timestamp: new Date().toISOString(),
                requestType: 'custom',
                roomNumber: room.room_number 
              }
            });
            
            // Remove channel after sending
            setTimeout(() => {
              supabase.removeChannel(notificationChannel);
            }, 1000);
          }
        });
      } catch (error) {
        console.error('Error sending realtime notification:', error);
      }
      
      // Use Sonner toast correctly
      sonnerToast.success('Requête envoyée', {
        description: 'Votre requête personnalisée a été soumise avec succès.'
      });
      
      onRequestSuccess();
    } catch (error) {
      console.error("Error submitting custom request:", error);
      toast({
        title: "Erreur",
        description: "Échec de la soumission de la requête. Veuillez réessayer.",
        variant: "destructive",
      });
      
      // Use Sonner toast for error
      sonnerToast.error('Erreur', {
        description: 'Échec de la soumission de la requête. Veuillez réessayer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-secondary mb-4">Requête personnalisée</h2>
      <form onSubmit={handleCustomRequest} className="flex gap-2">
        <Input
          value={customRequest}
          onChange={(e) => setCustomRequest(e.target.value)}
          placeholder="Oreillers supplémentaires, articles de toilette, etc."
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi...' : 'Soumettre'}
        </Button>
      </form>
    </div>
  );
};

export default CustomRequestForm;
