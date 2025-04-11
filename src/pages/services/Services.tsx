
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MessageCircle, FileText, Clock, Headphones } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRoom } from '@/hooks/useRoom';
import { v4 as uuidv4 } from 'uuid';
import ServiceCard from '@/features/services/components/ServiceCard';
import ServiceChat from '@/features/services/components/ServiceChat';
import RequestDialog from '@/features/services/components/RequestDialog';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

// Create custom icon components
const ShowerHead = () => (
  <svg
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="6" r="3" />
    <path d="M9 9v1.5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V9" />
    <path d="M6 12h12" />
    <path d="M10 16l.5-1" />
    <path d="M12 16v-1" />
    <path d="M14 16l-.5-1" />
  </svg>
);

const Wrench = () => (
  <svg
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const Bell = () => (
  <svg
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

interface UserInfo {
  name: string;
  roomNumber: string;
  email?: string;
  phone?: string;
  guestId?: string;
}

const Services = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const handleOpenRequestDialog = (category?: string) => {
    setSelectedCategory(category || null);
    setIsRequestDialogOpen(true);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-secondary mb-4">Hotel Services</h1>
          <p className="text-gray-600">24/7 dedicated concierge support</p>
        </div>

        {/* Service Request Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-secondary mb-6">Service Requests</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ServiceCard
              title="Housekeeping"
              description="Room cleaning, fresh towels, and other room services"
              icon={<ShowerHead />}
              actionText="Request Service"
              onAction={() => handleOpenRequestDialog('housekeeping')}
            />

            <ServiceCard
              title="Maintenance"
              description="Technical issues, repairs, and facility maintenance"
              icon={<Wrench />}
              actionText="Request Service"
              onAction={() => handleOpenRequestDialog('maintenance')}
            />

            <ServiceCard
              title="Reception"
              description="Check-in/out, information, and general assistance"
              icon={<Bell />}
              actionText="Request Service"
              onAction={() => handleOpenRequestDialog('reception')}
            />
          </div>
        </div>

        {/* Communication Methods */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-6">Contact Methods</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ServiceCard
              title="Live Chat"
              description="Instant messaging with our concierge team"
              icon={<MessageCircle />}
              actionText="Start Chat"
              onAction={handleStartChat}
            />

            <ServiceCard
              title="WhatsApp Service"
              description="Direct messaging via WhatsApp"
              icon={<Headphones />}
              actionText="Message Us"
              onAction={handleWhatsAppService}
            />

            <ServiceCard
              title="24/7 Support"
              description="Round-the-clock assistance for all your needs"
              icon={<Clock />}
              actionText="Contact Support"
              onAction={handleNavigateToSupport}
            />

            <ServiceCard
              title="All Requests"
              description="View and track all your service requests"
              icon={<FileText />}
              actionText="View Requests"
              onAction={() => navigate('/requests')}
            />
          </div>
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
        room={room || null}
        initialCategory={selectedCategory}
      />
    </Layout>
  );
};

export default Services;
