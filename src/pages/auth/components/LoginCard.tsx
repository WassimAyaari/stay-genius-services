
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import RegistrationForm from './RegistrationForm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const LoginCard: React.FC = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarFallback className="bg-primary text-white text-xl font-medium">
              SG
            </AvatarFallback>
          </Avatar>
        </div>
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
