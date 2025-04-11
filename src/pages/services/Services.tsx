
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MessageCircle, FileText, Clock, Headphones, Shower, Wrench, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRoom } from '@/hooks/useRoom';
import { v4 as uuidv4 } from 'uuid';
import ServiceCard from '@/features/services/components/ServiceCard';
import ServiceChat from '@/features/services/components/ServiceChat';
import RequestDialog from '@/features/services/components/RequestDialog';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

const Services = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    roomNumber: string;
    email?: string;
    phone?: string;
    guestId?: string;
  }>({
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
              icon={<Shower />}
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
