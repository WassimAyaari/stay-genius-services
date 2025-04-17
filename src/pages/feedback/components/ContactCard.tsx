
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContactCard = () => {
  return (
    <div className="mb-8">
      <Card className="p-6 rounded-xl bg-primary text-white">
        <h3 className="font-semibold text-lg mb-2">Need Immediate Assistance?</h3>
        <p className="mb-4">Our team is available 24/7 to address any concerns or answer questions.</p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100">
            Call Reception
          </Button>
          <Button variant="outline" className="w-full border-white text-white hover:bg-white/20">
            Live Chat
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ContactCard;
