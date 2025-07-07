
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, X } from "lucide-react";
import { CompanionData } from '@/features/users/types/userTypes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/features/auth/hooks/useAuthContext';
import { syncCompanions, deleteCompanion } from '@/features/users/services/companionService';

interface CompanionsListProps {
  companions: CompanionData[];
  onAddCompanion?: (companion: CompanionData) => void;
}

const relationOptions = [
  { value: "spouse", label: "Conjoint(e)" },
  { value: "child", label: "Enfant" },
  { value: "parent", label: "Parent" },
  { value: "friend", label: "Ami(e)" },
  { value: "other", label: "Autre" },
];

const CompanionsList = ({ companions, onAddCompanion }: CompanionsListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCompanion, setNewCompanion] = useState<Partial<CompanionData>>({
    first_name: '',
    last_name: '',
    relation: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddCompanion = async () => {
    if (!newCompanion.first_name || !newCompanion.last_name || !newCompanion.relation) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }

    const companionData: CompanionData = {
      first_name: newCompanion.first_name,
      last_name: newCompanion.last_name,
      relation: newCompanion.relation,
      firstName: newCompanion.first_name, // For backward compatibility
      lastName: newCompanion.last_name // For backward compatibility
    };

    if (onAddCompanion) {
      onAddCompanion(companionData);
      setIsDialogOpen(false);
      resetForm();
      return;
    }

    // If no callback provided, try to add directly to database
    if (user?.id) {
      try {
        // Add to the local list first for optimistic UI update
        const updatedCompanions = [...companions, companionData];
        await syncCompanions(user.id, updatedCompanions);
        
        toast({
          title: "Accompagnateur ajouté",
          description: "L'accompagnateur a été ajouté avec succès."
        });
        
        setIsDialogOpen(false);
        resetForm();
        
        // Force reload the page to refresh the companions list
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'accompagnateur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter l'accompagnateur. Veuillez réessayer."
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour ajouter un accompagnateur."
      });
    }
  };

  const handleDeleteCompanion = async (companionId?: string) => {
    if (!companionId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cet accompagnateur."
      });
      return;
    }

    try {
      const success = await deleteCompanion(companionId);
      
      if (success) {
        toast({
          title: "Accompagnateur supprimé",
          description: "L'accompagnateur a été supprimé avec succès."
        });
        
        // Force reload the page to refresh the companions list
        window.location.reload();
      } else {
        throw new Error("Failed to delete companion");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'accompagnateur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'accompagnateur. Veuillez réessayer."
      });
    }
  };

  const resetForm = () => {
    setNewCompanion({
      first_name: '',
      last_name: '',
      relation: ''
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Users className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Accompagnateurs</h2>
          </div>
        </div>
        {companions.length > 0 ? (
          <div className="divide-y">
            {companions.map((companion, index) => (
              <div key={companion.id || index} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{companion.first_name || companion.firstName} {companion.last_name || companion.lastName}</p>
                  <p className="text-sm text-muted-foreground">{companion.relation}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCompanion(companion.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Aucun accompagnateur ajouté
          </div>
        )}
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un accompagnateur
          </Button>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un accompagnateur</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Prénom</label>
                <Input 
                  value={newCompanion.first_name || ''} 
                  onChange={(e) => setNewCompanion({...newCompanion, first_name: e.target.value})}
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nom</label>
                <Input 
                  value={newCompanion.last_name || ''} 
                  onChange={(e) => setNewCompanion({...newCompanion, last_name: e.target.value})}
                  placeholder="Nom"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Relation</label>
              <Select 
                value={newCompanion.relation || ''} 
                onValueChange={(value) => setNewCompanion({...newCompanion, relation: value})}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAddCompanion}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CompanionsList;
