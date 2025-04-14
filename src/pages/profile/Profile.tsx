
import React from 'react';
import Layout from '@/components/Layout';
import ProfileHeader from './components/ProfileHeader';
import PersonalInformation from './components/PersonalInformation';
import CurrentStay from './components/CurrentStay';
import CompanionsList from './components/CompanionsList';
import NotificationsList from './components/NotificationsList';
import QuickActions from './components/QuickActions';
import { useProfileData } from './hooks/useProfileData';

const Profile = () => {
  const {
    userData,
    companions,
    notifications,
    stayDuration,
    dismissNotification,
    handleProfileImageChange,
    addCompanion
  } = useProfileData();

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <ProfileHeader 
          userData={userData} 
          handleProfileImageChange={handleProfileImageChange} 
        />
        
        <PersonalInformation userData={userData} />
        
        <CurrentStay 
          userData={userData} 
          stayDuration={stayDuration} 
        />
        
        <CompanionsList 
          companions={companions} 
          onAddCompanion={addCompanion}
        />
        
        <NotificationsList 
          notifications={notifications} 
          dismissNotification={dismissNotification} 
        />
        
        <QuickActions />
      </div>
    </Layout>
  );
};

export default Profile;
