
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import RegistrationForm from './RegistrationForm';

const LoginCard: React.FC = () => {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Stay Genius
        </h2>
        <p className="text-center text-sm text-gray-600">
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
