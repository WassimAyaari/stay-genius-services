
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { syncUserData } from '@/features/users/services/userService';
import { CompanionType } from '../components/CompanionsList';
import { CompanionData } from '@/features/users/types/userTypes';
import { registerUser } from '@/features/auth/services/authService';
import { supabase } from '@/integrations/supabase/client';
import { syncGuestData } from '@/features/users/services/guestService';

// Calculate the date 18 years ago for minimum age validation
const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

// Schema pour le formulaire d'inscription
export const registerSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  firstName: z.string().min(2, { message: "Le prénom est requis" }),
  lastName: z.string().min(2, { message: "Le nom est requis" }),
  birthDate: z.date({ required_error: "La date de naissance est requise" })
    .refine((date) => date <= eighteenYearsAgo, {
      message: "Vous devez avoir au moins 18 ans",
    }),
  nationality: z.string().min(2, { message: "La nationalité est requise" }),
  roomNumber: z.string().min(1, { message: "Le numéro de chambre est requis" }),
  checkInDate: z.date({ required_error: "La date d'arrivée est requise" })
    .refine((date) => date >= new Date(), {
      message: "La date d'arrivée ne peut pas être dans le passé",
    }),
  checkOutDate: z.date({ required_error: "La date de départ est requise" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string().min(6, { message: "La confirmation du mot de passe est requise" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
}).refine((data) => data.checkOutDate > data.checkInDate, {
  message: "La date de départ doit être après la date d'arrivée",
  path: ["checkOutDate"],
});

export type RegistrationFormValues = z.infer<typeof registerSchema>;

// Helper function to convert CompanionType to CompanionData
const mapCompanionsToCompanionData = (companions: CompanionType[]): CompanionData[] => {
  return companions.map(companion => ({
    first_name: companion.firstName,
    last_name: companion.lastName,
    relation: companion.relation,
    birthDate: companion.birthDate,
    firstName: companion.firstName,
    lastName: companion.lastName
  }));
};

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
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (values: RegistrationFormValues) => {
    setLoading(true);
    
    try {
      // Préparer les données utilisateur 
      const userData = {
        first_name: values.firstName,
        last_name: values.lastName,
        birth_date: values.birthDate,
        nationality: values.nationality,
        room_number: values.roomNumber,
        check_in_date: values.checkInDate,
        check_out_date: values.checkOutDate,
        companions: mapCompanionsToCompanionData(companions),
      };
      
      // Enregistrer l'utilisateur avec Supabase Auth
      const result = await registerUser(values.email, values.password, userData);
      
      if (!result.success) {
        throw new Error(result.error || "Erreur lors de l'inscription");
      }
      
      // Si userId est défini, synchroniser avec Supabase
      if (result.userId) {
        // Créer directement l'entrée dans la table guests
        const guestData = {
          user_id: result.userId,
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          room_number: values.roomNumber,
          nationality: values.nationality,
          birth_date: values.birthDate.toISOString().split('T')[0],
          check_in_date: values.checkInDate.toISOString().split('T')[0],
          check_out_date: values.checkOutDate.toISOString().split('T')[0]
        };
        
        // Créer l'invité directement dans la table guests
        const { error } = await supabase
          .from('guests')
          .insert([guestData]);
        
        if (error) {
          console.error('Erreur lors de la création de l\'invité:', error);
          toast({
            variant: "destructive",
            title: "Erreur lors de la création du profil invité",
            description: "Votre compte a été créé mais nous n'avons pas pu enregistrer votre profil d'invité.",
          });
        }
        
        // Synchroniser également avec la méthode existante pour la compatibilité
        const syncSuccess = await syncUserData({
          ...userData,
          email: values.email,
          id: result.userId
        });
        
        if (!syncSuccess) {
          toast({
            variant: "destructive",
            title: "Synchronisation échouée",
            description: "Les données ont été enregistrées localement mais la synchronisation avec le serveur a échoué.",
          });
        }
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
        title: "Erreur d'inscription",
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
