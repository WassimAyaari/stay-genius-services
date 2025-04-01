
import React from 'react';
import Layout from '@/components/Layout';
import RoomList from '@/components/RoomList';

const Rooms = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Nos Chambres</h1>
        <RoomList />
      </div>
    </Layout>
  );
};

export default Rooms;
