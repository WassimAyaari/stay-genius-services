
import React from 'react';
import { PlusCircle, Search, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestItem } from '@/features/rooms/types';
import { useRequestCategories } from '@/hooks/useRequestCategories';

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  openAddItemDialog: () => void;
  openEditDialog: (item: RequestItem) => void;
};

const SecurityItemsTab = ({
  searchTerm,
  setSearchTerm,
  openAddItemDialog,
  openEditDialog
}: Props) => {
  const { categories, allItems, isLoading } = useRequestCategories();

  // Catégorie sécurité (nom contient 'sécurité', 'secur', 'security')
  const securityCategory = categories.find(cat =>
    cat.name?.toLowerCase().includes('secur')
    || cat.name?.toLowerCase().includes('sécurité')
    || cat.name?.toLowerCase().includes('security')
  );

  // Items filtrés (catégorie sécurité, recherche par nom)
  const securityItems = allItems.filter(
    item => item.category_id === (securityCategory?.id || '') &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Items de sécurité</CardTitle>
          <Button
            onClick={openAddItemDialog}
            disabled={!securityCategory}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des items…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Chargement…</div>
        ) : securityItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {item.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {!securityCategory
              ? "Catégorie sécurité introuvable. Créez-la d'abord."
              : "Aucun item de sécurité trouvé."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityItemsTab;

