
import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import RoomList from '@/components/RoomList';

const Rooms = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">{t('nav.rooms')}</h1>
        <RoomList />
      </div>
    </Layout>
  );
};

export default Rooms;
