
import React from 'react';
import Layout from '@/components/Layout';

const Profile = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <p className="mb-4">
          Your profile information and settings will appear here.
        </p>
      </div>
    </Layout>
  );
};

export default Profile;
