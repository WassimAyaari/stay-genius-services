
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Building2, Users, Award, ChevronRight, Phone, Map, Book, Info } from 'lucide-react';
import { useHotelConfig } from '@/hooks/useHotelConfig';
import { InfoItem, FeatureItem } from '@/lib/types';

const About = () => {
  const { aboutData, isLoadingAbout } = useHotelConfig();

  if (isLoadingAbout || !aboutData) {
    return (
      <Layout>
        <div className="container mx-auto px-[21px] py-6">
          <h1 className="text-xl font-bold mb-4">Loading About Information...</h1>
        </div>
      </Layout>
    );
  }

  // Parse JSON data if needed
  const importantNumbers = Array.isArray(aboutData.important_numbers) 
    ? aboutData.important_numbers 
    : JSON.parse(aboutData.important_numbers || '[]');
  
  const hotelPolicies = Array.isArray(aboutData.hotel_policies) 
    ? aboutData.hotel_policies 
    : JSON.parse(aboutData.hotel_policies || '[]');
  
  const facilities = Array.isArray(aboutData.facilities) 
    ? aboutData.facilities 
    : JSON.parse(aboutData.facilities || '[]');
  
  const additionalInfo = Array.isArray(aboutData.additional_info) 
    ? aboutData.additional_info 
    : JSON.parse(aboutData.additional_info || '[]');
  
  const features = Array.isArray(aboutData.features) 
    ? aboutData.features 
    : JSON.parse(aboutData.features || '[]');

  // Helper function to get icon component
  const getIconComponent = (iconName, className = "h-6 w-6 text-primary") => {
    switch (iconName) {
      case 'History': return <History className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Award': return <Award className={className} />;
      default: return <Info className={className} />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-[21px] py-0">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-3xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Hotel Facade" className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <h1 className="text-3xl font-bold mb-2">About Hotel Genius</h1>
            <p className="text-xl mb-6">Luxury and comfort in every detail</p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">{aboutData.welcome_title}</h2>
          <p className="text-gray-600 mb-4">
            {aboutData.welcome_description}
          </p>
          <p className="text-gray-600 mb-4">
            {aboutData.welcome_description_extended}
          </p>
        </div>

        {/* Hotel Directory and Information */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">{aboutData.directory_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Important Numbers</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {importantNumbers.map((item, index) => (
                      <li key={index}>{item.label}: {String(item.value)}</li>
                    ))}
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
                    {hotelPolicies.map((item, index) => (
                      <li key={index}>{item.label}: {String(item.value)}</li>
                    ))}
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
                    {facilities.map((item, index) => (
                      <li key={index}>{item.label}: {String(item.value)}</li>
                    ))}
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
                    {additionalInfo.map((item, index) => (
                      <li key={index}>{item.label}: {String(item.value)}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {features.map((feature, index) => (
            <Card key={index} className="p-4 rounded-xl">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  {getIconComponent(feature.icon)}
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Our Mission</h2>
          <Card className="p-6 rounded-xl mb-4">
            <p className="text-gray-600">
              {aboutData.mission}
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;
