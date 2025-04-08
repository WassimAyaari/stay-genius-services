export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          recipient_id: string | null
          room_number: string
          sender: string
          status: string
          text: string
          updated_at: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_id?: string | null
          room_number: string
          sender: string
          status?: string
          text: string
          updated_at?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_id?: string | null
          room_number?: string
          sender?: string
          status?: string
          text?: string
          updated_at?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      companions: {
        Row: {
          birth_date: string | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          relation: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          relation: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          relation?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      event_reservations: {
        Row: {
          created_at: string
          date: string
          event_id: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          guests: number
          id: string
          room_number: string | null
          special_requests: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          event_id: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests: number
          id?: string
          room_number?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          event_id?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests?: number
          id?: string
          room_number?: string | null
          special_requests?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_reservations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          id: string
          image: string
          is_featured: boolean | null
          location: string | null
          time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          image: string
          is_featured?: boolean | null
          location?: string | null
          time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          image?: string
          is_featured?: boolean | null
          location?: string | null
          time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          birth_date: string | null
          check_in_date: string | null
          check_out_date: string | null
          created_at: string | null
          email: string | null
          first_name: string
          guest_type: string | null
          id: string
          last_name: string
          nationality: string | null
          phone: string | null
          profile_image: string | null
          room_number: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          birth_date?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          guest_type?: string | null
          id?: string
          last_name: string
          nationality?: string | null
          phone?: string | null
          profile_image?: string | null
          room_number?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          birth_date?: string | null
          check_in_date?: string | null
          check_out_date?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          guest_type?: string | null
          id?: string
          last_name?: string
          nationality?: string | null
          phone?: string | null
          profile_image?: string | null
          room_number?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hotel_about: {
        Row: {
          action_link: string
          action_text: string
          additional_info: Json | null
          created_at: string
          description: string
          directory_title: string | null
          facilities: Json | null
          features: Json | null
          hotel_id: string | null
          hotel_policies: Json | null
          icon: string
          id: string
          important_numbers: Json | null
          mission: string | null
          status: string
          title: string
          updated_at: string
          welcome_description: string | null
          welcome_description_extended: string | null
          welcome_title: string | null
        }
        Insert: {
          action_link: string
          action_text: string
          additional_info?: Json | null
          created_at?: string
          description: string
          directory_title?: string | null
          facilities?: Json | null
          features?: Json | null
          hotel_id?: string | null
          hotel_policies?: Json | null
          icon: string
          id?: string
          important_numbers?: Json | null
          mission?: string | null
          status?: string
          title: string
          updated_at?: string
          welcome_description?: string | null
          welcome_description_extended?: string | null
          welcome_title?: string | null
        }
        Update: {
          action_link?: string
          action_text?: string
          additional_info?: Json | null
          created_at?: string
          description?: string
          directory_title?: string | null
          facilities?: Json | null
          features?: Json | null
          hotel_id?: string | null
          hotel_policies?: Json | null
          icon?: string
          id?: string
          important_numbers?: Json | null
          mission?: string | null
          status?: string
          title?: string
          updated_at?: string
          welcome_description?: string | null
          welcome_description_extended?: string | null
          welcome_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_about_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_config: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          enabled_features: string[] | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string
          secondary_color: string
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          enabled_features?: string[] | null
          id?: string
          logo_url?: string | null
          name: string
          primary_color: string
          secondary_color: string
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          enabled_features?: string[] | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hotels: {
        Row: {
          address: string
          config: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          subdomain: string | null
          updated_at: string
        }
        Insert: {
          address: string
          config?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          subdomain?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          config?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          subdomain?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      request_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      request_items: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurant_menus: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          image: string | null
          is_featured: boolean | null
          name: string
          price: number
          restaurant_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          image?: string | null
          is_featured?: boolean | null
          name: string
          price: number
          restaurant_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image?: string | null
          is_featured?: boolean | null
          name?: string
          price?: number
          restaurant_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          action_text: string | null
          created_at: string | null
          cuisine: string
          description: string
          id: string
          images: string[]
          is_featured: boolean | null
          location: string
          name: string
          open_hours: string
          status: string
          updated_at: string | null
        }
        Insert: {
          action_text?: string | null
          created_at?: string | null
          cuisine: string
          description: string
          id?: string
          images?: string[]
          is_featured?: boolean | null
          location: string
          name: string
          open_hours: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          action_text?: string | null
          created_at?: string | null
          cuisine?: string
          description?: string
          id?: string
          images?: string[]
          is_featured?: boolean | null
          location?: string
          name?: string
          open_hours?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string | null
          floor: number
          id: string
          images: string[] | null
          price: number
          room_number: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          capacity: number
          created_at?: string | null
          floor: number
          id?: string
          images?: string[] | null
          price: number
          room_number: string
          status: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string | null
          floor?: number
          id?: string
          images?: string[] | null
          price?: number
          room_number?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          guest_id: string
          guest_name: string | null
          id: string
          request_item_id: string | null
          room_id: string
          room_number: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          guest_id: string
          guest_name?: string | null
          id?: string
          request_item_id?: string | null
          room_id: string
          room_number?: string | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          guest_id?: string
          guest_name?: string | null
          id?: string
          request_item_id?: string | null
          room_id?: string
          room_number?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          is_featured: boolean | null
          name: string
          price: number | null
          shop_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          name: string
          price?: number | null
          shop_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          name?: string
          price?: number | null
          shop_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          category_id: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string
          hours: string | null
          icon: string | null
          id: string
          image: string | null
          is_featured: boolean | null
          is_hotel_shop: boolean | null
          location: string | null
          name: string
          short_description: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description: string
          hours?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          is_hotel_shop?: boolean | null
          location?: string | null
          name: string
          short_description?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          hours?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          is_hotel_shop?: boolean | null
          location?: string | null
          name?: string
          short_description?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "shop_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      spa_bookings: {
        Row: {
          created_at: string | null
          date: string
          facility_id: string | null
          guest_email: string
          guest_name: string
          guest_phone: string | null
          id: string
          room_number: string | null
          service_id: string | null
          special_requests: string | null
          status: string
          time: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          facility_id?: string | null
          guest_email: string
          guest_name: string
          guest_phone?: string | null
          id?: string
          room_number?: string | null
          service_id?: string | null
          special_requests?: string | null
          status?: string
          time: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          facility_id?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string | null
          id?: string
          room_number?: string | null
          service_id?: string | null
          special_requests?: string | null
          status?: string
          time?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spa_bookings_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "spa_facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spa_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "spa_services"
            referencedColumns: ["id"]
          },
        ]
      }
      spa_facilities: {
        Row: {
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          location: string | null
          name: string
          opening_hours: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name: string
          opening_hours?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          name?: string
          opening_hours?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      spa_services: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration: string
          facility_id: string | null
          id: string
          image: string | null
          is_featured: boolean | null
          name: string
          price: number
          status: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration: string
          facility_id?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          name: string
          price: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration?: string
          facility_id?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          name?: string
          price?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spa_services_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "spa_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image: string
          is_active: boolean | null
          seen: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image: string
          is_active?: boolean | null
          seen?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          is_active?: boolean | null
          seen?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      table_reservations: {
        Row: {
          created_at: string | null
          date: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          guests: number
          id: string
          restaurant_id: string | null
          room_number: string | null
          special_requests: string | null
          status: string
          time: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests: number
          id?: string
          restaurant_id?: string | null
          room_number?: string | null
          special_requests?: string | null
          status?: string
          time: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          guests?: number
          id?: string
          restaurant_id?: string | null
          room_number?: string | null
          special_requests?: string | null
          status?: string
          time?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_guest_by_id: {
        Args: { p_user_id: string }
        Returns: {
          birth_date: string | null
          check_in_date: string | null
          check_out_date: string | null
          created_at: string | null
          email: string | null
          first_name: string
          guest_type: string | null
          id: string
          last_name: string
          nationality: string | null
          phone: string | null
          profile_image: string | null
          room_number: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
      }
      get_user_hotels: {
        Args: { user_id: string }
        Returns: {
          hotel_id: string
          role: string
        }[]
      }
      has_hotel_role: {
        Args: { user_id: string; hotel_id: string; required_role: string }
        Returns: boolean
      }
      insert_guest_from_registration: {
        Args:
          | {
              user_id: string
              first_name: string
              last_name: string
              email: string
              room_number: string
              nationality?: string
              birth_date?: string
              check_in_date?: string
              check_out_date?: string
            }
          | {
              user_id: string
              first_name: string
              last_name: string
              email: string
              room_number: string
              nationality?: string
              birth_date?: string
              check_in_date?: string
              check_out_date?: string
              phone?: string
              profile_image?: string
            }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_hotel_admin: {
        Args: { user_id: string; hotel_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
