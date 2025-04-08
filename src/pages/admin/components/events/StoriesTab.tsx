
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from 'lucide-react';
import { useStories } from '@/hooks/useStories';
import { Story } from '@/types/event';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StoryForm } from '@/pages/admin/components/events/StoryForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const StoriesTab = () => {
  const { stories, loading: storiesLoading, createStory, updateStory, deleteStory } = useStories();
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Stories List</h2>
        <Dialog open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStory(null)} className="bg-[#00AEBB]">
              <Plus className="h-4 w-4 mr-2" />
              Add a Story
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingStory ? 'Edit Story' : 'Add a Story'}</DialogTitle>
            </DialogHeader>
            <StoryForm 
              onSubmit={editingStory ? handleUpdateStory : handleCreateStory} 
              initialData={editingStory} 
              open={isStoryDialogOpen}
              onOpenChange={setIsStoryDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      {storiesLoading ? (
        <div className="p-6 text-center">Loading stories...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created on</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No stories found
                  </TableCell>
                </TableRow> 
              ) : (
                stories.map(story => (
                  <TableRow key={story.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img src={story.image} alt={story.title} className="h-full w-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>{story.title}</TableCell>
                    <TableCell>{story.category === 'event' ? 'Event' : 'Promotion'}</TableCell>
                    <TableCell>{format(new Date(story.created_at), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleToggleActive(story)} 
                        className={story.is_active ? 'text-green-500' : 'text-gray-500'}
                      >
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
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this story? This action is irreversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteStory(story.id)} className="bg-red-500 hover:bg-red-600">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
