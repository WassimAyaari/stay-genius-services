
export interface ShopCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  location?: string;
  hours?: string;
  image?: string;
  category_id?: string;
  is_hotel_shop?: boolean;
  is_featured?: boolean;
  icon?: string;
  contact_phone?: string;
  contact_email?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShopProduct {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  is_featured?: boolean;
  category?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShopCategoryFormData {
  name: string;
  description?: string;
  icon?: string;
}

export interface ShopFormData {
  name: string;
  description: string;
  short_description?: string;
  location?: string;
  hours?: string;
  image?: string;
  category_id?: string;
  is_hotel_shop?: boolean;
  is_featured?: boolean;
  icon?: string;
  contact_phone?: string;
  contact_email?: string;
  status?: string;
}

export interface ShopProductFormData {
  name: string;
  shop_id: string;
  description?: string;
  price?: number;
  image?: string;
  is_featured?: boolean;
  category?: string;
  status?: string;
}
