
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhoneCall, Mail, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';

const Contact = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-secondary text-center mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 animate-in fade-in-50 duration-500">
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <Input placeholder="Your Name" className="bg-gray-50/50" />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" className="bg-gray-50/50" />
              </div>
              <div>
                <Input placeholder="Subject" className="bg-gray-50/50" />
              </div>
              <div>
                <Textarea 
                  placeholder="Your Message"
                  className="min-h-[150px] bg-gray-50/50"
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </Card>

          <div className="space-y-4">
            <Card className="p-6 animate-in fade-in-50 duration-500 delay-100">
              <div className="flex items-start gap-4">
                <PhoneCall className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Phone</h3>
                  <p className="text-gray-600">+1 234 567 890</p>
                  <p className="text-gray-600">Available 24/7</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-in fade-in-50 duration-500 delay-200">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-gray-600">info@staygenius.com</p>
                  <p className="text-gray-600">support@staygenius.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 animate-in fade-in-50 duration-500 delay-300">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-2">Address</h3>
                  <p className="text-gray-600">
                    123 Luxury Avenue<br />
                    Paradise City, PC 12345<br />
                    United States
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
