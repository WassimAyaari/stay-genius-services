
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MessageCircle, FileText, Clock, Headphones as HeadphonesIcon, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRoom } from '@/hooks/useRoom';
import { v4 as uuidv4 } from 'uuid';
import ServiceCard from '@/features/services/components/ServiceCard';
import ServiceChat from '@/features/services/components/ServiceChat';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import RequestDialog from '@/features/services/components/RequestDialog';
import CommandSearch from '@/pages/my-room/components/CommandSearch';

interface UserInfo {
  name: string;
  roomNumber: string;
}

const Services = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
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
  
  const handleOpenRequestDialog = () => {
    setIsRequestDialogOpen(true);
  };

  const handleRequestSuccess = () => {
    toast({
      title: "Request Submitted",
      description: "Your service request has been submitted successfully."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-secondary mb-4">Hotel Services</h1>
          <p className="text-gray-600">24/7 dedicated concierge support</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <h2 className="text-xl font-medium text-secondary mb-3">Quick Service Search</h2>
          <CommandSearch 
            room={room} 
            onRequestSuccess={handleRequestSuccess} 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ServiceCard
            title="Live Chat"
            description="Instant messaging with our concierge team"
            icon={MessageCircle}
            actionText="Start Chat"
            onAction={handleStartChat}
          />

          <ServiceCard
            title="Request Service"
            description="Submit a specific request for assistance"
            icon={FileText}
            actionText="Make Request"
            onAction={handleOpenRequestDialog}
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
      
      <RequestDialog
        isOpen={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
        room={room}
      />
    </Layout>
  );
};

export default Services;
