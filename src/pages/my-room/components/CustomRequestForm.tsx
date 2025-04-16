
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

const CustomRequestForm = ({
  room,
  onRequestSuccess
}: CustomRequestFormProps) => {
  const [customRequest, setCustomRequest] = useState('');
  const { toast } = useToast();
  const { getUserInfo } = useUserInfo(room);

  const handleCustomRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequest.trim() || !room) return;

    try {
      const userInfo = getUserInfo();
      await requestService(room.id, 'custom', customRequest, undefined, undefined);
      setCustomRequest('');
      toast({
        title: "Custom Request Sent",
        description: "Your custom request has been submitted."
      });
      onRequestSuccess();
    } catch (error) {
      console.error("Error submitting custom request:", error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleCustomRequest} className="mb-8">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold">Custom Request</h3>
        <p className="text-sm text-gray-600">
          Have a special request? Let us know and we'll do our best to accommodate.
        </p>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={customRequest}
            onChange={(e) => setCustomRequest(e.target.value)}
            placeholder="Type your request here..."
            className="flex-1"
          />
          <Button type="submit" disabled={!customRequest.trim()}>
            Send
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CustomRequestForm;
