import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import SpaServiceCard from './SpaServiceCard';
import { useSpaServices } from '@/hooks/useSpaServices';
import { ChevronRight } from 'lucide-react';
import SwipeIndicator from '@/components/ui/swipe-indicator';
import useEmblaCarousel from 'embla-carousel-react';
interface SpaSectionProps {
  onBookService: (serviceId: string) => void;
}
const SpaSection = ({
  onBookService
}: SpaSectionProps) => {
  const {
    services,
    isLoading
  } = useSpaServices();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true
  });
  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);
  if (isLoading) {
    return <div className="text-center py-8">Loading services...</div>;
  }
  const displayServices = services?.slice(0, 6) || [];
  return;
};
export default SpaSection;