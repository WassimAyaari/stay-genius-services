
import React from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import WelcomeBanner from './components/WelcomeBanner';
import RequestHistory from './components/RequestHistory';
import ServicesGrid from './components/ServicesGrid';
import CustomRequestForm from './components/CustomRequestForm';

const MyRoom = () => {
  const { data: room, isLoading } = useRoom('401');
  const { data: serviceRequests = [], isLoading: isLoadingRequests, refetch: refetchRequests } = useServiceRequests();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <WelcomeBanner room={room} />
      
      <CustomRequestForm 
        room={room} 
        onRequestSuccess={() => refetchRequests()} 
      />

      <ServicesGrid 
        room={room} 
        onRequestSuccess={() => refetchRequests()} 
      />

      <RequestHistory 
        isLoading={isLoadingRequests}
        requests={serviceRequests}
      />
    </Layout>
  );
};

export default MyRoom;
