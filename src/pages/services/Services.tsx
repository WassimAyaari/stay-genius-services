
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MessageCircle, FileText, Clock, Headphones as HeadphonesIcon, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRoom } from '@/hooks/useRoom';
import { v4 as uuidv4 } from 'uuid';
import ServiceCard from '@/features/services/components/ServiceCard';
import ServiceChat from '@/features/services/components/ServiceChat';
import { requestService } from '@/features/rooms/controllers/roomService';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface UserInfo {
  name: string;
  roomNumber: string;
}

const Services = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Guest',
    roomNumber: ''
  });
  const { toast } = useToast();
  const { userData } = useAuth();
  
  const { data: room } = useRoom(userInfo.roomNumber);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        const fullName = `${parsedUserData.first_name || ''} ${parsedUserData.last_name || ''}`.trim();
        const roomNumber = parsedUserData.room_number || '';
        
        if (fullName || roomNumber) {
          setUserInfo({
            name: fullName || 'Guest',
            roomNumber: roomNumber
          });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleStartChat = () => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    setIsChatOpen(true);
  };

  const handleNavigateToSupport = () => {
    navigate('/messages?contact=1');
  };

  const handleWhatsAppService = () => {
    toast({
      title: "WhatsApp Service",
      description: "Opening WhatsApp to connect with our concierge team."
    });
    window.open('https://wa.me/+21628784080', '_blank');
  };

  const handleSubmitRequest = async () => {
    if (!requestMessage.trim() || !room) return;
    
    try {
      setSubmitting(true);
      let userId = localStorage.getItem('user_id');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('user_id', userId);
      }
      
      await requestService(
        room.id,
        'custom',
        requestMessage,
        undefined,
        undefined
      );
      
      toast({
        title: "Request Submitted",
        description: "Your request has been sent successfully."
      });
      
      setRequestMessage('');
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-secondary mb-4">Hotel Services</h1>
          <p className="text-gray-600">24/7 dedicated concierge support</p>
        </div>

        {/* Request Box */}
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-4">
            <Package className="w-6 h-6 text-primary mt-1" />
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-2">Submit a Request</h3>
              <p className="text-gray-600 mb-4">
                Tell us what you need and we'll take care of it
              </p>
              <Textarea 
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Describe your request... (extra towels, room service, etc.)"
                className="mb-4"
              />
              <Button 
                onClick={handleSubmitRequest}
                disabled={!requestMessage.trim() || submitting}
                className="w-full md:w-auto"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ServiceCard
            title="Live Chat"
            description="Instant messaging with our concierge team"
            icon={MessageCircle}
            actionText="Start Chat"
            onAction={handleStartChat}
          />

          <ServiceCard
            title="24/7 Support"
            description="Round-the-clock assistance for all your needs"
            icon={Clock}
            actionText="Contact Support"
            onAction={handleNavigateToSupport}
          />

          <ServiceCard
            title="WhatsApp Service"
            description="Direct messaging via WhatsApp"
            icon={HeadphonesIcon}
            actionText="Message Us"
            onAction={handleWhatsAppService}
          />
        </div>
      </div>

      <ServiceChat 
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        userInfo={userInfo}
      />
    </Layout>
  );
};

export default Services;
