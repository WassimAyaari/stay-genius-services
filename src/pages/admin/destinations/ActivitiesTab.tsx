import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { Edit, Trash } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity } from '@/features/types/supabaseTypes';

const ActivitiesTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  
  // Fetch activities
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destination_activities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });
  
  // Add a new activity
  const addMutation = useMutation({
    mutationFn: async (newActivity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('destination_activities')
        .insert(newActivity)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      resetForm();
      toast({
        title: "Activity Added",
        description: "The activity has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add activity: ${error.message}`
      });
    }
  });
  
  // Update an existing activity
  const updateMutation = useMutation({
    mutationFn: async (activity: Activity) => {
      const { data, error } = await supabase
        .from('destination_activities')
        .update({
          name: activity.name,
          description: activity.description,
          image: activity.image
        })
        .eq('id', activity.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      resetForm();
      toast({
        title: "Activity Updated",
        description: "The activity has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update activity: ${error.message}`
      });
    }
  });
  
  // Delete an activity
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('destination_activities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Activity Deleted",
        description: "The activity has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete activity: ${error.message}`
      });
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.image) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    if (isEditing && currentActivity) {
      updateMutation.mutate({
        id: currentActivity.id,
        ...formData
      });
    } else {
      addMutation.mutate(formData);
    }
  };
  
  const handleEdit = (activity: Activity) => {
    setIsEditing(true);
    setCurrentActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      image: activity.image
    });
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const resetForm = () => {
    setIsEditing(false);
    setCurrentActivity(null);
    setFormData({
      name: '',
      description: '',
      image: ''
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium">
              {isEditing ? 'Edit Activity' : 'Add New Activity'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    Activity Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., City Tour"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="description">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the activity"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image
                </label>
                <ImageUpload
                  id="image-upload"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  className="mb-4"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {isEditing ? 'Update Activity' : 'Add Activity'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <h3 className="text-lg font-medium">Things To Do</h3>
      
      {isLoading ? (
        <p>Loading activities...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    {activity.image && (
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>{activity.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{activity.description}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(activity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(activity.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No activities found. Add your first activity.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ActivitiesTab;
