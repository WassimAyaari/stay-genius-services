
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Building2, Users, Award, ChevronRight, Phone, Map, Book, Info } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-3xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Hotel Facade" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <h1 className="text-3xl font-bold mb-2">About Hotel Genius</h1>
            <p className="text-xl mb-6">Luxury and comfort in every detail</p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Welcome to Our Hotel</h2>
          <p className="text-gray-600 mb-4">
            Hotel Genius is a luxury hotel located in the heart of the city. We pride ourselves on providing exceptional service and an unforgettable experience for all our guests.
          </p>
          <p className="text-gray-600 mb-4">
            Since our establishment in 2010, we have been committed to creating a home away from home for our guests, combining modern amenities with classic hospitality.
          </p>
        </div>

        {/* Hotel Directory and Information */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Hotel Directory & Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Important Numbers</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>Reception: Dial 0</li>
                    <li>Room Service: Dial 1</li>
                    <li>Concierge: Dial 2</li>
                    <li>Housekeeping: Dial 3</li>
                    <li>Emergency: Dial 9</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hotel Policies</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>Check-in: 3:00 PM</li>
                    <li>Check-out: 12:00 PM</li>
                    <li>Breakfast: 6:30 AM - 10:30 AM</li>
                    <li>Pool Hours: 7:00 AM - 10:00 PM</li>
                    <li>Pet Policy: Pet-friendly rooms available</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Facilities & Amenities</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>Swimming Pool: Level 5</li>
                    <li>Fitness Center: Level 3</li>
                    <li>Spa & Wellness: Level 4</li>
                    <li>Business Center: Level 2</li>
                    <li>Restaurants: Lobby & Level 20</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Additional Information</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>Wi-Fi: Network "HotelGenius" - Password provided at check-in</li>
                    <li>Parking: Valet service available</li>
                    <li>Airport Transfer: Contact concierge</li>
                    <li>Currency Exchange: Available at reception</li>
                    <li>Medical Services: Contact reception for assistance</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <Card className="p-4 rounded-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Our History</h3>
              <p className="text-sm text-gray-600">Established in 2010 with a rich heritage</p>
            </div>
          </Card>

          <Card className="p-4 rounded-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Our Property</h3>
              <p className="text-sm text-gray-600">250 luxury rooms and premium facilities</p>
            </div>
          </Card>

          <Card className="p-4 rounded-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Our Team</h3>
              <p className="text-sm text-gray-600">Dedicated staff committed to excellence</p>
            </div>
          </Card>

          <Card className="p-4 rounded-xl">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Our Awards</h3>
              <p className="text-sm text-gray-600">Recognized for outstanding service</p>
            </div>
          </Card>
        </div>

        {/* Mission & Vision */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Our Mission & Vision</h2>
          <Card className="p-6 rounded-xl mb-4">
            <h3 className="text-lg font-semibold mb-2">Mission</h3>
            <p className="text-gray-600">
              To provide exceptional hospitality experiences by creating memorable moments for our guests through personalized service, luxurious accommodations, and innovative offerings.
            </p>
          </Card>
          <Card className="p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Vision</h3>
            <p className="text-gray-600">
              To be recognized as the leading luxury hotel brand, setting new standards in hospitality and inspiring others through our commitment to excellence.
            </p>
          </Card>
        </div>

        {/* Learn More Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">Discover More</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between p-4 text-left">
              <span>About Our Services</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="w-full justify-between p-4 text-left">
              <span>Sustainability Initiatives</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="w-full justify-between p-4 text-left">
              <span>Careers at Hotel Genius</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
