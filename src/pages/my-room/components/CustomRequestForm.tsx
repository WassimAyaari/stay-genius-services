
import React, { useState } from 'react';
import { Room } from '@/hooks/useRoom';
import { requestService } from '@/features/rooms/controllers/roomService';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserInfo } from '../hooks/useUserInfo';

interface CustomRequestFormProps {
  room: Room | null;
  onRequestSuccess: () => void;
}

const CustomRequestForm = ({ room, onRequestSuccess }: CustomRequestFormProps) => {
  const [customRequest, setCustomRequest] = useState('');
  const { toast } = useToast();
  const { getUserInfo } = useUserInfo(room);

  const handleCustomRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequest.trim() || !room) return;
    
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
        title: "Custom Request Sent",
        description: "Your custom request has been submitted.",
      });
      
      onRequestSuccess();
    } catch (error) {
      console.error("Error submitting custom request:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-secondary mb-4">Custom Request</h2>
      <form onSubmit={handleCustomRequest} className="flex gap-2">
        <Input
          value={customRequest}
          onChange={(e) => setCustomRequest(e.target.value)}
          placeholder="Extra pillows, amenities, etc."
          className="flex-1"
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default CustomRequestForm;
