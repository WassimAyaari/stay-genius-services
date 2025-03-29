
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema for the login form
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  roomNumber: z.string().min(1, { message: "Le numéro de chambre est requis" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      roomNumber: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    
    try {
      // Check if there's any user data in localStorage that matches the credentials
      const storedUserData = localStorage.getItem('user_data');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        
        if (userData.email === values.email && userData.room_number === values.roomNumber) {
          // If credentials match, consider the user authenticated
          toast({
            title: "Connexion réussie",
            description: "Bienvenue dans l'application Stay Genius",
          });
          
          // Redirect to the home page
          navigate('/');
        } else {
          // If credentials don't match
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Email ou numéro de chambre incorrect",
          });
        }
      } else {
        // If no user data is found
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Aucun utilisateur trouvé. Veuillez vous inscrire d'abord.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={loginForm.control}
          name="roomNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de chambre</FormLabel>
              <FormControl>
                <Input placeholder="Numéro de chambre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
