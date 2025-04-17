
import React from 'react';
import { Card } from '@/components/ui/card';

const FAQSection = () => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-secondary mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        <Card className="p-4 rounded-xl">
          <h3 className="font-semibold mb-2">How do I request special accommodations?</h3>
          <p className="text-sm text-gray-600">
            You can request special accommodations by contacting our concierge service directly through the app or by visiting the front desk.
          </p>
        </Card>
        
        <Card className="p-4 rounded-xl">
          <h3 className="font-semibold mb-2">What is the check-out process?</h3>
          <p className="text-sm text-gray-600">
            You can check out directly through the app, or visit the front desk. All room charges will be compiled and ready for review.
          </p>
        </Card>
        
        <Card className="p-4 rounded-xl">
          <h3 className="font-semibold mb-2">How can I extend my stay?</h3>
          <p className="text-sm text-gray-600">
            To extend your stay, please contact the front desk at least 24 hours before your scheduled check-out time to check availability.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default FAQSection;
