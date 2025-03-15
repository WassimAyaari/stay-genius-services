
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Building, Users, History, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">About Hotel Genius</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Welcome to Hotel Genius, where luxury meets comfort in a perfect blend of modern elegance and timeless hospitality.
        </p>
      </div>

      {/* Hero Image */}
      <div className="mb-10 px-6">
        <div className="rounded-xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Hotel Exterior" 
            className="w-full h-64 object-cover"
          />
        </div>
      </div>

      {/* Our Story */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Our Story</h2>
        <Card className="p-6">
          <p className="text-gray-600 mb-4">
            Founded in 1985, Hotel Genius has been a beacon of luxury hospitality for nearly four decades. What started as a boutique hotel with just 20 rooms has now evolved into a premier hospitality destination with over 200 rooms and suites.
          </p>
          <p className="text-gray-600">
            Our commitment to exceptional service, attention to detail, and creating memorable experiences for our guests has remained unwavering throughout our journey.
          </p>
        </Card>
      </section>

      {/* Key Features */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Why Choose Us</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Award Winning</h3>
              <p className="text-sm text-gray-600">Recognized for excellence in hospitality</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Prime Location</h3>
              <p className="text-sm text-gray-600">Situated in the heart of the city</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Expert Staff</h3>
              <p className="text-sm text-gray-600">Dedicated team of professionals</p>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Luxury Amenities</h3>
              <p className="text-sm text-gray-600">State-of-the-art facilities for guests</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-6 mb-10">
        <h2 className="text-2xl font-bold text-secondary mb-4">Our Values</h2>
        <Card className="p-6">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-secondary">Excellence</h3>
                <p className="text-sm text-gray-600">We strive for excellence in every aspect of our service.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-secondary">Integrity</h3>
                <p className="text-sm text-gray-600">We conduct our business with the highest ethical standards.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-secondary">Innovation</h3>
                <p className="text-sm text-gray-600">We continuously evolve to meet the changing needs of our guests.</p>
              </div>
            </li>
          </ul>
        </Card>
      </section>

      {/* Contact Section */}
      <section className="px-6 mb-10">
        <Card className="bg-primary/5 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-secondary mb-3">Get in Touch</h3>
          <p className="text-gray-600 mb-4">
            Have questions or need more information about Hotel Genius? We'd love to hear from you.
          </p>
          <Button className="w-full">Contact Us</Button>
        </Card>
      </section>
    </Layout>
  );
};

export default About;
