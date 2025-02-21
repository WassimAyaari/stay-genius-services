
import React from 'react';
import { CarouselItem } from '@/components/ui/carousel';
import SpaServiceCard from './SpaServiceCard';
import { SpaService } from '../types';

const SpaSection = () => {
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
