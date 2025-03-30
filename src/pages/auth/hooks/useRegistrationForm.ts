
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { syncUserData } from '@/features/users/services/userService';
import { CompanionType } from '../components/CompanionsList';

// Schema pour le formulaire d'inscription
export const registerSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  firstName: z.string().min(2, { message: "Le prénom est requis" }),
  lastName: z.string().min(2, { message: "Le nom est requis" }),
  birthDate: z.date({ required_error: "La date de naissance est requise" }),
  nationality: z.string().min(2, { message: "La nationalité est requise" }),
  roomNumber: z.string().min(1, { message: "Le numéro de chambre est requis" }),
  checkInDate: z.date({ required_error: "La date d'arrivée est requise" }),
  checkOutDate: z.date({ required_error: "La date de départ est requise" }),
});

export type RegistrationFormValues = z.infer<typeof registerSchema>;

export const useRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companions, setCompanions] = useState<CompanionType[]>([]);

  // Formulaire d'inscription
  const registerForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      nationality: "",
      roomNumber: "",
    },
  });

  const handleRegister = async (values: RegistrationFormValues) => {
    setLoading(true);
    
    try {
      // Préparer les données utilisateur pour la table guests
      const userData = {
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        birth_date: values.birthDate,
        nationality: values.nationality,
        room_number: values.roomNumber,
        check_in_date: values.checkInDate,
        check_out_date: values.checkOutDate,
        companions: companions,
      };
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Synchroniser avec Supabase (profiles et guests)
      const syncSuccess = await syncUserData(userData);
      
      if (!syncSuccess) {
        toast({
          variant: "destructive",
          title: "Synchronisation échouée",
          description: "Les données ont été enregistrées localement mais la synchronisation avec le serveur a échoué.",
        });
      }
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue dans l'application Stay Genius",
      });
      
      // Rediriger vers la page d'accueil
      navigate('/');
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

  return {
    loading,
    companions,
    setCompanions,
    registerForm,
    handleRegister
  };
};
