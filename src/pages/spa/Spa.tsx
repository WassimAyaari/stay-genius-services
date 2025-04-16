
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import { useSpaServices } from '@/hooks/useSpaServices';
import BookingDialog from '@/features/spa/components/SpaBookingDialog';
import SpaSection from '@/features/spa/components/SpaSection';

const Spa = () => {
  const { featuredServices, isLoading } = useSpaServices();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleBookTreatment = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingOpen(false);
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Spa & Wellness</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Relax and rejuvenate with our luxurious spa treatments and wellness services
        </p>
      </div>

      <SpaSection onBookService={handleBookTreatment} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {featuredServices && featuredServices.map((service) => (
          <Card key={service.id} className="overflow-hidden animate-fade-in">
            <img 
              src={service.image || "/lovable-uploads/3cbdcf79-9da5-48bd-90f2-2c1737b76741.png"}
              alt={service.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-secondary">{service.name}</h3>
                <span className="text-primary font-semibold">${service.price}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <span>{service.duration}</span>
              </div>
              <p className="text-gray-600 mb-4">
                {service.description}
              </p>
              <Button 
                className="w-full"
                onClick={() => handleBookTreatment(service.id)}
              >
                Book Treatment
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {isBookingOpen && selectedService && (
        <BookingDialog
          isOpen={isBookingOpen}
          onOpenChange={setIsBookingOpen}
          serviceId={selectedService}
          onSuccess={handleBookingSuccess}
        />
      )}
    </Layout>
  );
};

export default Spa;
