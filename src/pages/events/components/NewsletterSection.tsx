
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ticket } from 'lucide-react';

export const NewsletterSection = () => {
  return (
    <Card className="p-6 rounded-xl bg-primary/5">
      <h3 className="text-xl font-semibold mb-2 text-center">Stay Informed</h3>
      <p className="text-center text-gray-600 mb-4">
        Subscribe to receive alerts about new events and promotions
      </p>
      <div className="flex gap-2">
        <Input placeholder="Enter your email" className="flex-1" />
        <Button className="gap-2">
          <Ticket className="h-4 w-4" />
          Subscribe
        </Button>
      </div>
    </Card>
  );
};
