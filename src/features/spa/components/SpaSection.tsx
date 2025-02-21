
import React from 'react';
import { CarouselItem } from '@/components/ui/carousel';
import SpaServiceCard from './SpaServiceCard';

const SpaSection = () => {
  const spaServices = [
    {
      id: '1',
      name: 'Swedish Massage',
      description: '60-minute relaxing massage',
      price: '$120',
      duration: '60 min',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Deep Tissue Massage',
      description: 'Therapeutic deep tissue treatment',
      price: '$140',
      duration: '60 min',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Aromatherapy',
      description: 'Essential oils massage therapy',
      price: '$130',
      duration: '60 min',
      image: '/placeholder.svg'
    }
  ];

  return (
    <>
      {spaServices.map((service) => (
        <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
          <SpaServiceCard service={service} />
        </CarouselItem>
      ))}
    </>
  );
};

export default SpaSection;
