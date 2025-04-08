
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchShops, 
  fetchShopById, 
  createShop, 
  updateShop, 
  deleteShop 
} from '@/features/shops/services/shopService';
import { 
  fetchShopCategories, 
  createShopCategory, 
  updateShopCategory, 
  deleteShopCategory 
} from '@/features/shops/services/shopCategoryService';
import { 
  fetchShopProducts, 
  createShopProduct, 
  updateShopProduct, 
  deleteShopProduct 
} from '@/features/shops/services/shopProductService';
import { 
  Shop, 
  ShopFormData, 
  ShopCategory, 
  ShopCategoryFormData, 
  ShopProduct, 
  ShopProductFormData 
} from '@/types/shop';
import { toast } from 'sonner';

export const useShops = () => {
  const queryClient = useQueryClient();

  // Shop queries
  const shopsQuery = useQuery({
    queryKey: ['shops'],
    queryFn: fetchShops
  });

  const shopQuery = (id: string) => useQuery({
    queryKey: ['shop', id],
    queryFn: () => fetchShopById(id),
    enabled: !!id
  });

  // Shop mutations
  const createShopMutation = useMutation({
    mutationFn: (shopData: ShopFormData) => createShop(shopData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      toast.success('Boutique créée avec succès');
    }
  });

  const updateShopMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ShopFormData }) => updateShop(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      toast.success('Boutique mise à jour avec succès');
    }
  });

  const deleteShopMutation = useMutation({
    mutationFn: (id: string) => deleteShop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      toast.success('Boutique supprimée avec succès');
    }
  });

  // Category queries
  const categoriesQuery = useQuery({
    queryKey: ['shopCategories'],
    queryFn: fetchShopCategories
  });

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: (categoryData: ShopCategoryFormData) => createShopCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopCategories'] });
      toast.success('Catégorie créée avec succès');
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ShopCategoryFormData }) => updateShopCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopCategories'] });
      toast.success('Catégorie mise à jour avec succès');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteShopCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopCategories'] });
      toast.success('Catégorie supprimée avec succès');
    }
  });

  // Product queries
  const productsQuery = (shopId?: string) => useQuery({
    queryKey: ['shopProducts', shopId],
    queryFn: () => fetchShopProducts(shopId)
  });

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: (productData: ShopProductFormData) => createShopProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] });
      toast.success('Produit créé avec succès');
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ShopProductFormData }) => updateShopProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] });
      toast.success('Produit mis à jour avec succès');
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteShopProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopProducts'] });
      toast.success('Produit supprimé avec succès');
    }
  });

  return {
    // Shops
    shops: shopsQuery.data || [],
    isLoadingShops: shopsQuery.isLoading,
    shopQuery,
    createShop: createShopMutation.mutate,
    updateShop: updateShopMutation.mutate,
    deleteShop: deleteShopMutation.mutate,
    
    // Categories
    categories: categoriesQuery.data || [],
    isLoadingCategories: categoriesQuery.isLoading,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    
    // Products
    productsQuery,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate
  };
};
