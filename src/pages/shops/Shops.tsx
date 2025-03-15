
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Clock, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';

const Shops = () => {
  const shops = [
    {
      id: 1,
      name: 'Luxury Boutique',
      category: 'Fashion',
      description: 'High-end fashion and accessories',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      hours: '10:00 AM - 8:00 PM',
      location: 'Ground Floor, East Wing'
    },
    {
      id: 2,
      name: 'Gourmet Market',
      category: 'Food',
      description: 'Specialty foods and delicacies',
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
      hours: '8:00 AM - 10:00 PM',
      location: 'Ground Floor, West Wing'
    },
    {
      id: 3,
      name: 'Gift Shop',
      category: 'Souvenirs',
      description: 'Unique gifts and local souvenirs',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      hours: '9:00 AM - 9:00 PM',
      location: 'Lobby Level'
    }
  ];

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-secondary mb-4">Hotel Shops</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our exclusive collection of luxury boutiques and specialty shops
        </p>
      </div>

      <div className="space-y-6 px-6">
        {shops.map(shop => (
          <Card key={shop.id} className="overflow-hidden">
            <div className="relative h-48">
              <img 
                src={shop.image} 
                alt={shop.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 bg-primary/80 text-white px-3 py-1 text-sm">
                {shop.category}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-secondary mb-1">{shop.name}</h3>
              <p className="text-gray-600 mb-3">{shop.description}</p>
              
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Clock className="w-4 h-4" />
                <span>{shop.hours}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>{shop.location}</span>
              </div>
              
              <Button className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Visit Shop
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Shops;
