
import React, { useState } from 'react';
import { useHotel } from '@/context/HotelContext';
import { useHotelRoles } from '@/hooks/useHotelRoles';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, UserPlus, Edit, Trash2, Search, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserSearchResult {
  id: string;
  email: string;
  display_name?: string;
}

const HotelStaff = () => {
  const { hotel } = useHotel();
  const { roles, isLoading, addRole, updateRole, removeRole } = useHotelRoles(hotel?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'manager' | 'staff' | 'guest'>('staff');

  if (!hotel) return null;

  const searchUsers = async () => {
    if (!searchTerm || searchTerm.length < 3) {
      toast({
        variant: "destructive",
        title: "Erreur de recherche",
        description: "Veuillez entrer au moins 3 caractères pour la recherche",
      });
      return;
    }

    try {
      setSearching(true);
      // Dans un environnement réel, vous utiliseriez une fonction RPC ou une Edge Function
      // pour rechercher un utilisateur par email, car c'est plus sécurisé
      // Pour cet exemple, nous simulons une recherche utilisateur
      
      // Simulation - dans la vraie vie, cela viendrait de Supabase
      setTimeout(() => {
        const mockResults: UserSearchResult[] = [
          { id: '123e4567-e89b-12d3-a456-426614174000', email: 'john.doe@example.com', display_name: 'John Doe' },
          { id: '223e4567-e89b-12d3-a456-426614174001', email: 'jane.smith@example.com', display_name: 'Jane Smith' },
        ].filter(user => 
          user.email.includes(searchTerm) || 
          user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setUserSearchResults(mockResults);
        setSearching(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rechercher les utilisateurs",
      });
      setSearching(false);
    }
  };

  const handleAddRole = async () => {
    if (!selectedUser) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un utilisateur",
      });
      return;
    }

    await addRole.mutateAsync({
      user_id: selectedUser.id,
      hotel_id: hotel.id,
      role: selectedRole
    });

    // Réinitialiser le formulaire
    setSelectedUser(null);
    setSelectedRole('staff');
    setUserSearchResults([]);
    setSearchTerm("");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-green-100 text-green-800';
      case 'guest':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
          <p className="text-gray-500">Gérez les accès utilisateurs à cet hôtel</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Ajouter un membre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un membre</DialogTitle>
              <DialogDescription>
                Recherchez un utilisateur et assignez-lui un rôle pour cet hôtel.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de l'utilisateur</Label>
                <div className="flex space-x-2">
                  <Input
                    id="email"
                    placeholder="Rechercher par email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={searchUsers}
                    disabled={searching}
                  >
                    {searching ? 
                      <Loader2 className="h-4 w-4 animate-spin" /> : 
                      <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {userSearchResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Résultats de recherche</Label>
                  <div className="border rounded-md overflow-hidden">
                    {userSearchResults.map(user => (
                      <div
                        key={user.id}
                        className={`p-3 cursor-pointer hover:bg-gray-100 ${
                          selectedUser?.id === user.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="font-medium">{user.display_name || 'Utilisateur'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedUser && (
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle pour {selectedUser.display_name || selectedUser.email}</Label>
                  <Select 
                    value={selectedRole} 
                    onValueChange={(value) => setSelectedRole(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Personnel</SelectItem>
                      <SelectItem value="guest">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button 
                onClick={handleAddRole} 
                disabled={!selectedUser || addRole.isPending}
              >
                {addRole.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membres avec accès</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableCaption>Liste des membres avec accès à {hotel.name}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      Aucun membre trouvé. Ajoutez des membres pour gérer les accès.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="font-medium">Jane Doe</div>
                        <div className="text-sm text-gray-500">jane.doe@example.com</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role.role)}`}>
                          {role.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(role.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier le rôle
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => removeRole.mutate(role.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer l'accès
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelStaff;
