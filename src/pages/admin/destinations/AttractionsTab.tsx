
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

interface Attraction {
  id: string;
  name: string;
  description: string;
  image: string;
  distance: string;
  opening_hours: string;
}

const AttractionsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [currentAttraction, setCurrentAttraction] = useState<Attraction | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    distance: '',
    opening_hours: ''
  });
  
  // Fetch attractions
  const { data: attractions, isLoading } = useQuery({
    queryKey: ['attractions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Attraction[];
    }
  });
  
  // Add a new attraction
  const addMutation = useMutation({
    mutationFn: async (newAttraction: Omit<Attraction, 'id'>) => {
      const { data, error } = await supabase
        .from('attractions')
        .insert(newAttraction)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attractions'] });
      resetForm();
      toast({
        title: "Attraction Added",
        description: "The attraction has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add attraction: ${error.message}`
      });
    }
  });
  
  // Update an existing attraction
  const updateMutation = useMutation({
    mutationFn: async (attraction: Attraction) => {
      const { data, error } = await supabase
        .from('attractions')
        .update({
          name: attraction.name,
          description: attraction.description,
          image: attraction.image,
          distance: attraction.distance,
          opening_hours: attraction.opening_hours
        })
        .eq('id', attraction.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attractions'] });
      resetForm();
      toast({
        title: "Attraction Updated",
        description: "The attraction has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update attraction: ${error.message}`
      });
    }
  });
  
  // Delete an attraction
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attractions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attractions'] });
      toast({
        title: "Attraction Deleted",
        description: "The attraction has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete attraction: ${error.message}`
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
    
    if (isEditing && currentAttraction) {
      updateMutation.mutate({
        id: currentAttraction.id,
        ...formData
      });
    } else {
      addMutation.mutate(formData);
    }
  };
  
  const handleEdit = (attraction: Attraction) => {
    setIsEditing(true);
    setCurrentAttraction(attraction);
    setFormData({
      name: attraction.name,
      description: attraction.description,
      image: attraction.image,
      distance: attraction.distance,
      opening_hours: attraction.opening_hours
    });
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this attraction?")) {
      deleteMutation.mutate(id);
    }
  };
  
  const resetForm = () => {
    setIsEditing(false);
    setCurrentAttraction(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      distance: '',
      opening_hours: ''
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium">
              {isEditing ? 'Edit Attraction' : 'Add New Attraction'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    Attraction Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Art Museum"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="distance">
                    Distance
                  </label>
                  <Input
                    id="distance"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    placeholder="e.g., 1.2 km away"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="opening_hours">
                    Opening Hours
                  </label>
                  <Input
                    id="opening_hours"
                    value={formData.opening_hours}
                    onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                    placeholder="e.g., Open until 6 PM"
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
                    placeholder="Brief description of the attraction"
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
                {isEditing ? 'Update Attraction' : 'Add Attraction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <h3 className="text-lg font-medium">Popular Attractions</h3>
      
      {isLoading ? (
        <p>Loading attractions...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Opening Hours</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attractions && attractions.length > 0 ? (
              attractions.map((attraction) => (
                <TableRow key={attraction.id}>
                  <TableCell>
                    {attraction.image && (
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>{attraction.name}</TableCell>
                  <TableCell>{attraction.distance}</TableCell>
                  <TableCell>{attraction.opening_hours}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(attraction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(attraction.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No attractions found. Add your first attraction.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AttractionsTab;
