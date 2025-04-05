
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from 'lucide-react';
import { useStories } from '@/hooks/useStories';
import { Story } from '@/types/event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StoryForm } from '@/pages/admin/components/events/StoryForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export const StoriesTab = () => {
  const { stories, loading: storiesLoading, createStory, updateStory, deleteStory } = useStories();
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  
  // Limiter aux 5 premiers stories
  const limitedStories = stories.slice(0, 5);
  
  const handleCreateStory = async (story: Omit<Story, 'id' | 'created_at' | 'updated_at'>) => {
    await createStory(story);
    setIsStoryDialogOpen(false);
  };
  
  const handleUpdateStory = async (story: Partial<Story>) => {
    if (editingStory) {
      await updateStory(editingStory.id, story);
      setEditingStory(null);
      setIsStoryDialogOpen(false);
    }
  };
  
  const handleEditStory = (story: Story) => {
    setEditingStory(story);
    setIsStoryDialogOpen(true);
  };
  
  const handleToggleActive = async (story: Story) => {
    await updateStory(story.id, {
      is_active: !story.is_active
    });
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Liste des stories</h2>
        <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStory(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une story
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{editingStory ? 'Modifier la story' : 'Ajouter une story'}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <StoryForm 
                onSubmit={editingStory ? handleUpdateStory : handleCreateStory} 
                initialData={editingStory} 
                open={isStoryDialogOpen}
                onOpenChange={setIsStoryDialogOpen}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="flex-1 overflow-hidden">
        {storiesLoading ? <div className="p-6 text-center">Chargement des stories...</div> : 
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {limitedStories.length === 0 ? 
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Aucune story trouvée
                    </TableCell>
                  </TableRow> 
                : 
                  limitedStories.map(story => (
                    <TableRow key={story.id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img src={story.image} alt={story.title} className="h-full w-full object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>{story.title}</TableCell>
                      <TableCell>{story.category === 'event' ? 'Événement' : 'Promotion'}</TableCell>
                      <TableCell>{format(new Date(story.created_at), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleActive(story)} className={story.is_active ? 'text-green-500' : 'text-gray-500'}>
                          {story.is_active ? 'Active' : 'Inactive'}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditStory(story)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette story ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteStory(story.id)} className="bg-red-500 hover:bg-red-600">
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            {stories.length > 5 && (
              <div className="p-4 text-center">
                <Button variant="link">Voir toutes les stories ({stories.length})</Button>
              </div>
            )}
          </ScrollArea>
        }
      </Card>
    </>
  );
};
