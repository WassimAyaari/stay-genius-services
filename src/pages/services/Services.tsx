
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MessageCircle, Headphones as HeadphonesIcon, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRoom } from '@/hooks/useRoom';
import { v4 as uuidv4 } from 'uuid';
import ServiceCard from '@/features/services/components/ServiceCard';
import ServiceChat from '@/features/services/components/ServiceChat';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import CommandSearch from '@/pages/my-room/components/CommandSearch';

interface UserInfo {
  name: string;
  roomNumber: string;
}

const Services = () => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'Guest',
    roomNumber: ''
  });
  const { toast } = useToast();
  const { userData } = useAuth();
  
  // Get room from user info or context
  const roomNumber = userInfo.roomNumber || userData?.room_number || localStorage.getItem('user_room_number') || '';
  const { data: room } = useRoom(roomNumber);

  useEffect(() => {
    // Initialize user info from various sources
    // 1. First try Auth context
    if (userData) {
      const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
      if (fullName || userData.room_number) {
        setUserInfo({
          name: fullName || 'Guest',
          roomNumber: userData.room_number || ''
        });
        
        // Save room number to localStorage for future use
        if (userData.room_number) {
          localStorage.setItem('user_room_number', userData.room_number);
        }
        return;
      }
    }
    
    // 2. Try localStorage
    const storedUserData = localStorage.getItem('user_data');
    const storedRoomNumber = localStorage.getItem('user_room_number');
    
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        const fullName = `${parsedUserData.first_name || ''} ${parsedUserData.last_name || ''}`.trim();
        const roomNumber = parsedUserData.room_number || storedRoomNumber || '';
        
        if (fullName || roomNumber) {
          setUserInfo({
            name: fullName || 'Guest',
            roomNumber: roomNumber
          });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else if (storedRoomNumber) {
      // If only room number is available
      setUserInfo(prev => ({
        ...prev,
        roomNumber: storedRoomNumber
      }));
    }
  }, [userData]);

  const handleStartChat = () => {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    
    // Ensure room number is stored before opening chat
    if (userInfo.roomNumber && !localStorage.getItem('user_room_number')) {
      localStorage.setItem('user_room_number', userInfo.roomNumber);
    }
    
    setIsChatOpen(true);
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

        {/* Enhanced Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <h2 className="text-xl font-medium text-secondary mb-3">Quick Service Search</h2>
          <div className="relative">
            <div className="relative flex items-center border rounded-xl px-4 py-3.5 bg-white shadow-md cursor-pointer hover:shadow-lg transition-all group">
              <Search className="h-5 w-5 mr-3 text-primary group-hover:text-primary/80 transition-colors" />
              <span className="text-gray-500 group-hover:text-gray-700 transition-colors">Search for services (towels, cleaning, wifi support...)</span>
            </div>
            
            <div className="absolute inset-0" onClick={() => {}}>
              <CommandSearch 
                room={room} 
                onRequestSuccess={() => {
                  toast({
                    title: "Request Sent",
                    description: "Your service request has been submitted successfully."
                  });
                }} 
              />
            </div>
          </div>
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
