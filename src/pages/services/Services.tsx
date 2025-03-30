
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MessageCircle, FileText, Clock, Headphones as HeadphonesIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRoom } from '@/hooks/useRoom';
import { v4 as uuidv4 } from 'uuid';
import ServiceCard from '@/features/services/components/ServiceCard';
import ServiceChat from '@/features/services/components/ServiceChat';
import UserInfoDialog from '@/features/services/components/UserInfoDialog';
import RequestDialog from '@/features/services/components/RequestDialog';

interface UserInfo {
  name: string;
  roomNumber: string;
}

const Services = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    roomNumber: ''
  });
  const { toast } = useToast();
  // Pass room number to useRoom hook to fetch room data
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
            name: fullName,
            roomNumber: roomNumber
          });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleStartChat = () => {
    if (!userInfo.name.trim() || !userInfo.roomNumber.trim()) {
      setIsUserInfoDialogOpen(true);
      return;
    }

    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    setIsChatOpen(true);
  };

  const handleSubmitUserInfo = () => {
    if (!userInfo.name.trim() || !userInfo.roomNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and room number.",
        variant: "destructive"
      });
      return;
    }
    
    // Save user data in the expected format
    localStorage.setItem('user_data', JSON.stringify({
      first_name: userInfo.name.split(' ')[0],
      last_name: userInfo.name.split(' ').slice(1).join(' '),
      room_number: userInfo.roomNumber
    }));

    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    setIsUserInfoDialogOpen(false);
    setIsChatOpen(true);
  };

  const handleOpenRequestDialog = () => {
    setIsRequestDialogOpen(true);
  };

  const handleNavigateToRequests = () => {
    handleOpenRequestDialog();
  };

  const handleNavigateToSupport = () => {
    navigate('/messages?contact=1');
  };

  const handleWhatsAppService = () => {
    toast({
      title: "WhatsApp Service",
      description: "Opening WhatsApp to connect with our concierge team."
    });
    window.open('https://wa.me/1234567890', '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-secondary mb-4">Hotel Services</h1>
          <p className="text-gray-600">24/7 dedicated concierge support</p>
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
            title="Inquiries & Requests"
            description="Submit and track your requests"
            icon={FileText}
            actionText="New Request"
            onAction={handleNavigateToRequests}
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

      <UserInfoDialog
        isOpen={isUserInfoDialogOpen}
        onOpenChange={setIsUserInfoDialogOpen}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        onSubmit={handleSubmitUserInfo}
      />

      <RequestDialog
        isOpen={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
        room={room || null}
      />
    </Layout>
  );
};

export default Services;
