
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { Button } from '@/components/ui/button';

const LoginCard: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Stay Genius
        </h2>
        <p className="text-center text-sm text-gray-600">
          {isLogin 
            ? "Connectez-vous pour accéder à vos services hôteliers" 
            : "Créez votre compte pour accéder à vos services hôteliers"}
        </p>
      </CardHeader>
      <CardContent>
        {isLogin ? <LoginForm /> : <RegistrationForm />}
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <Button 
          variant="link" 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm"
        >
          {isLogin 
            ? "Vous n'avez pas de compte ? Inscrivez-vous" 
            : "Déjà inscrit ? Connectez-vous"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
