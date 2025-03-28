
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Schema pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" })
});

// Schema pour le formulaire d'inscription
const registerSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  firstName: z.string().min(2, { message: "Le prénom est requis" }),
  lastName: z.string().min(2, { message: "Le nom est requis" }),
  birthDate: z.date({ required_error: "La date de naissance est requise" }),
  nationality: z.string().min(2, { message: "La nationalité est requise" }),
  roomNumber: z.string().min(1, { message: "Le numéro de chambre est requis" }),
  checkInDate: z.date({ required_error: "La date d'arrivée est requise" }),
  checkOutDate: z.date({ required_error: "La date de départ est requise" }),
});

const relationOptions = [
  { value: "spouse", label: "Conjoint(e)" },
  { value: "child", label: "Enfant" },
  { value: "parent", label: "Parent" },
  { value: "friend", label: "Ami(e)" },
  { value: "other", label: "Autre" },
];

type CompanionType = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  relation: string;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [companions, setCompanions] = useState<CompanionType[]>([]);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  // Formulaire de connexion
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  // Formulaire d'inscription
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      nationality: "",
      roomNumber: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      
      toast({
        title: "Lien de connexion envoyé",
        description: "Veuillez vérifier votre email pour vous connecter.",
      });
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

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setLoading(true);
    
    try {
      // Enregistrement de l'utilisateur avec OTP
      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            birth_date: values.birthDate.toISOString(),
            nationality: values.nationality,
            room_number: values.roomNumber,
            check_in_date: values.checkInDate.toISOString(),
            check_out_date: values.checkOutDate.toISOString(),
            companions: companions,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Lien de vérification envoyé",
        description: "Veuillez vérifier votre email pour confirmer votre compte.",
      });
      
      setActiveTab("login");
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

  const addCompanion = () => {
    setCompanions([
      ...companions,
      { firstName: "", lastName: "", birthDate: new Date(), relation: "" }
    ]);
  };

  const removeCompanion = (index: number) => {
    setCompanions(companions.filter((_, i) => i !== index));
  };

  const updateCompanion = (index: number, field: keyof CompanionType, value: any) => {
    const newCompanions = [...companions];
    newCompanions[index] = { ...newCompanions[index], [field]: value };
    setCompanions(newCompanions);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Stay Genius
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à vos services hôteliers
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Recevoir un lien de connexion'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de naissance</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "P")
                                ) : (
                                  <span>Sélectionner une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationalité</FormLabel>
                        <FormControl>
                          <Input placeholder="Nationalité" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date d'arrivée</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "P")
                                  ) : (
                                    <span>Sélectionner</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date de départ</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "P")
                                  ) : (
                                    <span>Sélectionner</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
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
                  
                  {companions.length > 0 && (
                    <div className="space-y-4 mt-6">
                      <h3 className="font-medium">Accompagnants</h3>
                      
                      {companions.map((companion, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-4 relative">
                          <button 
                            type="button"
                            onClick={() => removeCompanion(index)}
                            className="absolute top-2 right-2 h-6 w-6 p-0 flex items-center justify-center text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Prénom</label>
                              <Input 
                                value={companion.firstName} 
                                onChange={(e) => updateCompanion(index, 'firstName', e.target.value)}
                                placeholder="Prénom"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Nom</label>
                              <Input 
                                value={companion.lastName} 
                                onChange={(e) => updateCompanion(index, 'lastName', e.target.value)}
                                placeholder="Nom"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Date de naissance</label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal w-full",
                                    )}
                                  >
                                    {companion.birthDate ? (
                                      format(companion.birthDate, "P")
                                    ) : (
                                      <span>Sélectionner</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={companion.birthDate}
                                    onSelect={(date) => updateCompanion(index, 'birthDate', date)}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Relation</label>
                              <Select
                                value={companion.relation}
                                onValueChange={(value) => updateCompanion(index, 'relation', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  {relationOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={addCompanion}
                  >
                    Ajouter un accompagnant
                  </Button>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Créer un compte'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
