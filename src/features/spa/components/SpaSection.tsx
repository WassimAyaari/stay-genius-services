
import React from 'react';
import { CarouselItem } from '@/components/ui/carousel';
import SpaServiceCard from './SpaServiceCard';
import { SpaService } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SpaSection = () => {
  const { toast } = useToast();

  const spaServices: SpaService[] = [
    {
      id: '1',
      name: 'Swedish Massage',
      description: '60-minute relaxing massage',
      price: 120,
      duration: '60 min',
      image: '/placeholder.svg',
      category: 'massage',
      availability: 'available'
    },
    {
      id: '2',
      name: 'Deep Tissue Massage',
      description: 'Therapeutic deep tissue treatment',
      price: 140,
      duration: '60 min',
      image: '/placeholder.svg',
      category: 'massage',
      availability: 'available'
    },
    {
      id: '3',
      name: 'Aromatherapy',
      description: 'Essential oils massage therapy',
      price: 130,
      duration: '60 min',
      image: '/placeholder.svg',
      category: 'wellness',
      availability: 'available'
    }
  ];

  const handleBookService = async (serviceId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to book a spa service');

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

  return (
    <>
      {spaServices.map((service) => (
        <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
          <SpaServiceCard service={service} onBook={handleBookService} />
        </CarouselItem>
      ))}
    </>
  );
};

export default SpaSection;
