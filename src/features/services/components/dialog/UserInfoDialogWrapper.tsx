
import React from 'react';
import UserInfoDialog from '@/features/services/components/UserInfoDialog';
import { UserInfo } from '@/features/services/hooks/useUserInfo';

interface UserInfoDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  onSubmit: () => void;
}

const UserInfoDialogWrapper = ({
  isOpen,
  onOpenChange,
  userInfo,
  setUserInfo,
  onSubmit
}: UserInfoDialogWrapperProps) => {
  return (
    <UserInfoDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      userInfo={userInfo}
      setUserInfo={setUserInfo}
      onSubmit={onSubmit}
    />
  );
};

export default UserInfoDialogWrapper;
