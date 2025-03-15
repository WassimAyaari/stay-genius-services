
import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, ExternalLink, ShoppingBag, ShirtIcon, Watch, Gem, Coffee } from 'lucide-react';

const Shops = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-3xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Shopping" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Boutiques & Shopping</h1>
            <p className="text-xl mb-6">Luxury retail experiences</p>
          </div>
        </div>

        {/* Hotel Boutiques */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Hotel Boutiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src="https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                  alt="Fashion Boutique" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-2 py-1 m-2 rounded">
                  Premium
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Fashion Boutique</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>10:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <ShirtIcon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Discover our curated collection of designer clothing and accessories for both men and women.
                </p>
                <Button size="sm" className="w-full">Visit Store</Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src="https://images.unsplash.com/photo-1465822744566-4e71bf2bb5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Jewelry Store" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Jewelry & Watches</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>11:00 AM - 7:00 PM</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Gem className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Exclusive selection of fine jewelry, watches, and other luxury accessories.
                </p>
                <Button size="sm" className="w-full">Visit Store</Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src="https://images.unsplash.com/photo-1455651269149-0be9a0ee47a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Gift Shop" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Gift Shop</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>9:00 AM - 9:00 PM</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Souvenirs, local crafts, and thoughtful gifts to remember your stay.
                </p>
                <Button size="sm" className="w-full">Visit Store</Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src="https://images.unsplash.com/photo-1521849599984-7c0316f5a5e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Gourmet Shop" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Gourmet Market</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>8:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Coffee className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Finest selection of gourmet foods, wines, and specialty products.
                </p>
                <Button size="sm" className="w-full">Visit Store</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Nearby Shopping */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-secondary mb-4">Nearby Shopping Centers</h2>
          <div className="space-y-4">
            <Card className="p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="relative min-w-[100px] h-24 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1568254183919-78a4f43a2877?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                    alt="Luxury Mall" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Luxury Avenue Mall</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>1.5 km away</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">High-end shopping mall with over 100 luxury brand stores and restaurants.</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                    <Button size="sm" className="text-xs">Visit Website</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="relative min-w-[100px] h-24 rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1610523377847-5672d5f46089?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
                    alt="Shopping Street" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Central Shopping District</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>0.8 km away</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Historic shopping area with a mix of global brands and local boutiques.</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">Get Directions</Button>
                    <Button size="sm" className="text-xs">View Map</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-4">Shopping Services</h2>
          <Card className="p-6 rounded-xl">
            <h3 className="font-semibold mb-3">Concierge Shopping Assistance</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our concierge team can arrange personal shopping assistance, store appointments, and delivery services for your convenience.
            </p>
            <Button className="w-full">Request Shopping Assistance</Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Shops;
