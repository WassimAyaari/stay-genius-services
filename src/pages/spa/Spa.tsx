
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';

const Spa = () => {
  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Spa & Wellness</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Relax and rejuvenate with our luxurious spa treatments and wellness services
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden animate-fade-in">
          <img 
            src="/lovable-uploads/3cbdcf79-9da5-48bd-90f2-2c1737b76741.png"
            alt="Luxury Spa Package"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-secondary">Luxury Massage</h3>
              <span className="text-primary font-semibold">$120</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-4 h-4" />
              <span>90 minutes</span>
            </div>
            <p className="text-gray-600 mb-4">
              Indulge in a full body massage with aromatherapy oils
            </p>
            <Button className="w-full">Book Treatment</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="p-4 text-center">
          <Heart className="w-6 h-6 mx-auto text-primary mb-2" />
          <h4 className="font-medium">Wellness Classes</h4>
        </Card>
        <Card className="p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto text-primary mb-2" />
          <h4 className="font-medium">Schedule</h4>
        </Card>
      </div>
    </Layout>
  );
};

export default Spa;
