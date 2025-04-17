
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageSquare, Image, UserCheck, Mail } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHotelConfig } from '@/hooks/useHotelConfig';

// Types pour les feedbacks
interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  date: string;
}

const FeedbackManager = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [heroImage, setHeroImage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { config, isLoading: configLoading, updateConfig } = useHotelConfig();

  // Simuler le chargement des feedbacks (à remplacer par une vraie API)
  useEffect(() => {
    // Simuler un chargement de données
    const mockFeedbacks: Feedback[] = [
      {
        id: '1',
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        rating: 5,
        comment: 'Excellent séjour, le personnel est très professionnel et attentionné.',
        date: '2025-04-15'
      },
      {
        id: '2',
        name: 'Marie Martin',
        email: 'marie.martin@example.com',
        rating: 4,
        comment: 'Très bon séjour, mais certains équipements mériteraient d\'être modernisés.',
        date: '2025-04-14'
      },
      {
        id: '3',
        name: 'Pierre Lefebvre',
        email: 'pierre.lefebvre@example.com',
        rating: 5,
        comment: 'Une expérience inoubliable, je reviendrai certainement!',
        date: '2025-04-12'
      }
    ];
    setFeedbacks(mockFeedbacks);
  }, []);

  // Charger l'image de l'en-tête depuis la configuration
  useEffect(() => {
    console.log("Admin config loaded:", config);
    if (config && config.feedback_hero_image) {
      console.log("Admin setting hero image to:", config.feedback_hero_image);
      setHeroImage(config.feedback_hero_image);
    } else {
      // Image par défaut
      setHeroImage('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
    }
  }, [config]);

  const handleImageUpdate = () => {
    setLoading(true);
    
    console.log("Updating hero image to:", heroImage);
    
    // Mettre à jour la configuration avec la nouvelle image
    updateConfig({
      feedback_hero_image: heroImage
    });
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Image mise à jour",
        description: "L'image d'en-tête a été mise à jour avec succès.",
      });
    }, 1000);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-primary text-primary' : 'text-gray-300'}`} />
    ));
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-2">Gestion des Feedbacks</h1>
        <p className="text-muted-foreground mb-6">Gérez les avis et personnalisez la page de feedback</p>
        
        <Tabs defaultValue="reviews" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Avis clients</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Apparence</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avis récents</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbacks.length === 0 ? (
                  <p className="text-muted-foreground">Aucun avis pour le moment.</p>
                ) : (
                  <ScrollArea className="h-[450px] pr-4">
                    <div className="space-y-4">
                      {feedbacks.map((feedback) => (
                        <Card key={feedback.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold">{feedback.name}</h3>
                              <p className="text-sm text-muted-foreground">{feedback.email}</p>
                            </div>
                            <div className="flex items-center">
                              {renderStars(feedback.rating)}
                            </div>
                          </div>
                          <p className="text-sm mb-2">{feedback.comment}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {new Date(feedback.date).toLocaleDateString()}
                            </span>
                            <Button variant="ghost" size="sm">
                              Répondre
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Image d'en-tête</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ImageUpload 
                    id="hero-image" 
                    value={heroImage} 
                    onChange={setHeroImage} 
                    className="max-w-2xl mx-auto"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleImageUpdate} disabled={loading}>
                      {loading ? 'Mise à jour...' : 'Mettre à jour l\'image'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FeedbackManager;
