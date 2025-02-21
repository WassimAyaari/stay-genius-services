
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, FileText, Clock, HeadphonesIcon } from 'lucide-react';
import Layout from '@/components/Layout';

const Services = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-secondary mb-4">Hotel Services</h1>
          <p className="text-gray-600">24/7 dedicated concierge support</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">
                  Instant messaging with our concierge team
                </p>
                <Button variant="outline">Start Chat</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Inquiries & Requests</h3>
                <p className="text-gray-600 mb-4">
                  Submit and track your requests
                </p>
                <Button variant="outline">New Request</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600 mb-4">
                  Round-the-clock assistance for all your needs
                </p>
                <Button variant="outline">Contact Support</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <HeadphonesIcon className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-2">WhatsApp Service</h3>
                <p className="text-gray-600 mb-4">
                  Direct messaging via WhatsApp
                </p>
                <Button variant="outline">Message Us</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
