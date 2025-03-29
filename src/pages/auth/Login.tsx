
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginCard from './components/LoginCard';

const Login = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Vérifier aussi le localStorage pour notre méthode d'authentification simplifiée
        const userData = localStorage.getItem('user_data');
        
        if (session || userData) {
          navigate('/');
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginCard />
    </div>
  );
};

export default Login;
