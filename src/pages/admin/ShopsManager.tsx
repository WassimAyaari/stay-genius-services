
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useShops } from '@/hooks/useShops';
import ShopsTab from '@/pages/admin/shops/ShopsTab';
import CategoriesTab from '@/pages/admin/shops/CategoriesTab';
import ProductsTab from '@/pages/admin/shops/ProductsTab';
import NearbyShopsTab from '@/pages/admin/shops/NearbyShopsTab';

const ShopsManager = () => {
  const [activeTab, setActiveTab] = useState('shops');

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6 text-secondary">Shop Management</h1>
        
        <Tabs defaultValue="shops" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="shops">Hotel Shops</TabsTrigger>
            <TabsTrigger value="nearby">Nearby Centers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shops">
            <ShopsTab />
          </TabsContent>

          <TabsContent value="nearby">
            <NearbyShopsTab />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ShopsManager;
