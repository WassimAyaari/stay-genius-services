import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.id) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          // Pick the highest-priority role
          const priority: string[] = ['admin', 'moderator', 'staff', 'user'];
          const roles = (data || []).map(r => r.role as string);
          const highest = priority.find(p => roles.includes(p)) || null;
          setRole(highest);
        }
      } catch (error) {
        console.error('Error in role fetch:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user?.id]);

  return { role, loading, isAdmin: role === 'admin', isModerator: role === 'moderator' };
};
