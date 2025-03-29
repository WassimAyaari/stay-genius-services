
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginCard from './components/LoginCard';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
      
      // Vérifier aussi le localStorage pour notre méthode d'authentification simplifiée
      const userData = localStorage.getItem('user_data');
      if (userData) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-light to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginCard />
      </motion.div>
      <p className="mt-8 text-center text-sm text-gray-500">
        Pour une expérience hôtelière personnalisée
      </p>
    </div>
  );
};

export default Login;
