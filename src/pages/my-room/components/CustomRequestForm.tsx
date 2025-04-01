
import React, { useState } from 'react';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserInfo } from '../hooks/useUserInfo';
import { useQueryClient } from '@tanstack/react-query';

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
      
      // Invalidate the requests cache to show the new request
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
      
      onRequestSuccess();
    } catch (error) {
      console.error("Error submitting custom request:", error);
      toast({
        title: "Erreur",
        description: "Échec de la soumission de la requête. Veuillez réessayer.",
        variant: "destructive",
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
