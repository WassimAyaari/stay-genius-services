
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { useShops } from '@/hooks/useShops';
import ShopsTab from '@/pages/admin/shops/ShopsTab';
import CategoriesTab from '@/pages/admin/shops/CategoriesTab';
import ProductsTab from '@/pages/admin/shops/ProductsTab';

const ShopsManager = () => {
  const [activeTab, setActiveTab] = useState('shops');

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6 text-secondary">Gestion des boutiques</h1>
        
        <Tabs defaultValue="shops" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="shops">Boutiques</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shops">
            <ShopsTab />
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
