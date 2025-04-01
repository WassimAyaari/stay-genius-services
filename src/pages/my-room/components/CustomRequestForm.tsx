
import React, { useState } from 'react';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserInfo } from '../hooks/useUserInfo';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
      
      await requestService(
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
      }, 200);
      
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, 1000);
      
      // Also notify with Sonner toast for better visibility
      toast.success('Requête envoyée', {
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
      
      // Also show a more visible error with Sonner
      toast.error('Erreur', {
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
