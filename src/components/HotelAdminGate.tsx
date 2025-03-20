
import React, { useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { HotelProvider } from '@/context/HotelContext';
import HotelAdminLayout from './HotelAdminLayout';
import { Loader2 } from 'lucide-react';

const HotelAdminGate = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: authData } = await supabase.auth.getSession();
        
        if (!authData.session?.user) {
          navigate('/auth/login');
          return;
        }
        
        const userId = authData.session.user.id;
        
        // Vérifier si l'utilisateur est super admin
        const { data: isSuperAdmin } = await supabase.rpc('is_super_admin', {
          user_id: userId
        });
        
        if (isSuperAdmin) {
          setHasAccess(true);
          setLoading(false);
          return;
        }
        
        // Vérifier si l'utilisateur a un rôle admin pour cet hôtel
        const { data: hasRole } = await supabase.rpc('has_hotel_role', {
          user_id: userId,
          hotel_id: hotelId,
          required_role: 'admin'
        });
        
        if (hasRole) {
          setHasAccess(true);
        } else {
          navigate('/unauthorized');
        }
      } catch (error) {
        console.error('Error checking access:', error);
        navigate('/unauthorized');
      } finally {
        setLoading(false);
      }
    };
    
    if (hotelId) {
      checkAccess();
    }
  }, [hotelId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Already navigated away
  }

  return (
    <HotelProvider hotelId={hotelId}>
      <HotelAdminLayout>
        <Outlet />
      </HotelAdminLayout>
    </HotelProvider>
  );
};

export default HotelAdminGate;
