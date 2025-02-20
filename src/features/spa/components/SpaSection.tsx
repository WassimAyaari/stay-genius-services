
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SpaServiceCard from './SpaServiceCard';
import { SpaService } from '../types';
import { useToast } from '@/hooks/use-toast';

const SpaSection = () => {
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery({
    queryKey: ['spa-services'],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: '1',
          name: 'Deep Tissue Massage',
          description: 'A therapeutic massage focusing on deep layers of muscle',
          duration: '60 minutes',
          price: 120,
          image: '/placeholder.svg',
          category: 'massage' as const,
          availability: 'available' as const
        },
        {
          id: '2',
          name: 'Luxury Facial',
          description: 'Rejuvenating facial treatment with premium products',
          duration: '45 minutes',
          price: 95,
          image: '/placeholder.svg',
          category: 'facial' as const,
          availability: 'available' as const
        }
      ];
    }
  });

  const handleBookService = async (serviceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to book a spa service');

      // TODO: Add booking logic here
      toast({
        title: "Success",
        description: "Spa service booked successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-gray-400">Loading spa services...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services?.map((service) => (
        <SpaServiceCard
          key={service.id}
          service={service}
          onBook={handleBookService}
        />
      ))}
    </div>
  );
};

export default SpaSection;
