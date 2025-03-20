
import React, { useState } from 'react';
import { useHotel } from '@/context/HotelContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Loader2, Check, X } from 'lucide-react';
import { HotelConfig } from '@/lib/types';

const HotelSettings = () => {
  const { hotel, updateConfig, loading } = useHotel();
  const [saving, setSaving] = useState(false);
  const [themeConfig, setThemeConfig] = useState(hotel?.config?.theme || { primary: '#1e40af', secondary: '#4f46e5' });
  const [features, setFeatures] = useState(hotel?.config?.enabled_features || []);

  if (loading || !hotel) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const availableFeatures = [
    { id: 'rooms', label: 'Gestion des chambres' },
    { id: 'dining', label: 'Restauration' },
    { id: 'spa', label: 'Spa & Bien-être' },
    { id: 'events', label: 'Événements' },
    { id: 'activities', label: 'Activités' },
    { id: 'shops', label: 'Boutiques' }
  ];

  const handleColorChange = (key: keyof typeof themeConfig, value: string) => {
    setThemeConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    if (checked) {
      setFeatures(prev => [...prev, featureId]);
    } else {
      setFeatures(prev => prev.filter(id => id !== featureId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (saving) return;
    
    try {
      setSaving(true);
      
      const updatedConfig: HotelConfig = {
        theme: themeConfig,
        enabled_features: features
      };
      
      await updateConfig(updatedConfig);
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de l'hôtel ont été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating hotel settings:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour des paramètres.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres de l'hôtel</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-8">
          {/* Apparence */}
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>Personnalisez les couleurs de l'interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeConfig.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={themeConfig.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={themeConfig.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={themeConfig.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Aperçu</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="h-16 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: themeConfig.primary }}
                  >
                    Couleur principale
                  </div>
                  <div
                    className="h-16 rounded-md flex items-center justify-center text-white"
                    style={{ backgroundColor: themeConfig.secondary }}
                  >
                    Couleur secondaire
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Fonctionnalités */}
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités</CardTitle>
              <CardDescription>Activer ou désactiver les fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature.id}`}
                      checked={features.includes(feature.id)}
                      onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked === true)}
                    />
                    <Label htmlFor={`feature-${feature.id}`} className="cursor-pointer">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button">
            Annuler
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HotelSettings;
