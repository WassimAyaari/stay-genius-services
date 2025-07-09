
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedChatContainer } from '@/components/chat/UnifiedChatContainer';
import { AdminChatDashboard } from '@/components/admin/chat/AdminChatDashboard';

const Messages = () => {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email?: string;
    roomNumber?: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user is admin
        const { data: adminCheck } = await supabase.rpc('is_admin', { user_id: user.id });
        setIsAdmin(adminCheck || false);

        if (!adminCheck) {
          // Get guest info for regular users
          const { data: guestData } = await supabase
            .from('guests')
            .select('first_name, last_name, email, room_number')
            .eq('user_id', user.id)
            .single();

          if (guestData) {
            setUserInfo({
              name: `${guestData.first_name} ${guestData.last_name}`,
              email: guestData.email || user.email,
              roomNumber: guestData.room_number || undefined
            });
          } else {
            // Fallback for users without guest record
            setUserInfo({
              name: user.email?.split('@')[0] || 'Guest',
              email: user.email || undefined
            });
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        // Set default user info on error
        setUserInfo({
          name: 'Guest'
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndRole();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin dashboard for admin users
  if (isAdmin) {
    return <AdminChatDashboard />;
  }

  // Show unified chat for regular users
  if (!userInfo) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Unable to load user information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background">
      <UnifiedChatContainer userInfo={userInfo} />
    </div>
  );
};

export default Messages;
