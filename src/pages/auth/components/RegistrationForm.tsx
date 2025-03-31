
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from "@/components/ui/form";
import CompanionsList from './CompanionsList';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import BasicInfoFields from './form/BasicInfoFields';
import DateFields from './form/DateFields';
import AdditionalFields from './form/AdditionalFields';
import PasswordField from './form/PasswordField';

const RegistrationForm: React.FC = () => {
  const { 
    loading, 
    companions, 
    setCompanions, 
    registerForm, 
    handleRegister 
  } = useRegistrationForm();

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
        <BasicInfoFields form={registerForm} />
        <DateFields form={registerForm} />
        <AdditionalFields form={registerForm} />
        <PasswordField form={registerForm} />
        
        <CompanionsList
          companions={companions}
          setCompanions={setCompanions}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Inscription en cours...' : 'Accéder à l\'application'}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
