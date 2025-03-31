
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

const LoginCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('login');

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Stay Genius
        </h2>
        <p className="text-center text-sm text-gray-600">
          {activeTab === 'login' 
            ? 'Connectez-vous pour accéder à vos services hôteliers' 
            : 'Créez votre compte pour accéder à vos services hôteliers'}
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegistrationForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
