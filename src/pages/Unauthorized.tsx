
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
        
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link 
            to="/"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Retour à l'accueil
          </Link>
          
          <Link
            to="/auth/login"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Se connecter avec un autre compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
