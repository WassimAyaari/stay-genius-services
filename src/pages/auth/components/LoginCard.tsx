
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import RegistrationForm from './RegistrationForm';

const LoginCard: React.FC = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Stay Genius
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Créez votre compte pour accéder à vos services hôteliers
        </p>
      </CardHeader>
      <CardContent>
        <RegistrationForm />
      </CardContent>
    </Card>
  );
};

export default LoginCard;
