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
      activities: {
        Row: {
          capacity: number
          category: string
          created_at: string | null
          date: string
          description: string | null
          duration: string
          id: string
          image: string | null
          location: string
          name: string
          price: number
          status: string
          time: string
          updated_at: string | null
        }
        Insert: {
          capacity: number
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          duration: string
          id?: string
          image?: string | null
          location: string
          name: string
          price: number
          status?: string
          time: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          duration?: string
          id?: string
          image?: string | null
          location?: string
          name?: string
          price?: number
          status?: string
          time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      activity_bookings: {
        Row: {
          activity_id: string
          created_at: string | null
          id: string
          participants: number
          special_requests: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string | null
          id?: string
          participants?: number
          special_requests?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string | null
          id?: string
          participants?: number
          special_requests?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_bookings_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string | null
          guest_id: string | null
          id: string
          room_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string | null
          guest_id?: string | null
          id?: string
          room_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string | null
          guest_id?: string | null
          id?: string
          room_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
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
      hotel_admins: {
        Row: {
          created_at: string
          hotel_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hotel_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hotel_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_admins_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_assistance: {
        Row: {
          action_link: string
          action_text: string
          background_image: string
          created_at: string
          description: string
          hotel_id: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          action_link: string
          action_text: string
          background_image: string
          created_at?: string
          description: string
          hotel_id?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          action_link?: string
          action_text?: string
          background_image?: string
          created_at?: string
          description?: string
          hotel_id?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_assistance_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_config: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hotel_events: {
        Row: {
          action_link: string
          action_text: string
          created_at: string
          date: string
          description: string
          display_order: number
          hotel_id: string | null
          id: string
          image: string
          location: string
          status: string
          time: string
          title: string
          updated_at: string
        }
        Insert: {
          action_link: string
          action_text: string
          created_at?: string
          date: string
          description: string
          display_order?: number
          hotel_id?: string | null
          id?: string
          image: string
          location: string
          status?: string
          time: string
          title: string
          updated_at?: string
        }
        Update: {
          action_link?: string
          action_text?: string
          created_at?: string
          date?: string
          description?: string
          display_order?: number
          hotel_id?: string | null
          id?: string
          image?: string
          location?: string
          status?: string
          time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_events_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_experiences: {
        Row: {
          action_link: string
          action_text: string
          category: string
          created_at: string
          description: string
          display_order: number
          hotel_id: string | null
          id: string
          image: string
          status: string
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          action_link: string
          action_text: string
          category: string
          created_at?: string
          description: string
          display_order?: number
          hotel_id?: string | null
          id?: string
          image: string
          status?: string
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          action_link?: string
          action_text?: string
          category?: string
          created_at?: string
          description?: string
          display_order?: number
          hotel_id?: string | null
          id?: string
          image?: string
          status?: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_experiences_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_hero: {
        Row: {
          background_image: string
          created_at: string
          hotel_id: string | null
          id: string
          search_placeholder: string
          status: string
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          background_image: string
          created_at?: string
          hotel_id?: string | null
          id?: string
          search_placeholder: string
          status?: string
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          background_image?: string
          created_at?: string
          hotel_id?: string | null
          id?: string
          search_placeholder?: string
          status?: string
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_hero_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_services: {
        Row: {
          action_link: string
          action_text: string
          created_at: string
          description: string
          display_order: number
          hotel_id: string | null
          icon: string
          id: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          action_link: string
          action_text: string
          created_at?: string
          description: string
          display_order?: number
          hotel_id?: string | null
          icon: string
          id?: string
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          action_link?: string
          action_text?: string
          created_at?: string
          description?: string
          display_order?: number
          hotel_id?: string | null
          icon?: string
          id?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_services_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_stories: {
        Row: {
          content: string
          created_at: string
          display_order: number
          hotel_id: string | null
          id: string
          image: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          display_order?: number
          hotel_id?: string | null
          id?: string
          image: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          display_order?: number
          hotel_id?: string | null
          id?: string
          image?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_stories_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_user_roles: {
        Row: {
          created_at: string
          hotel_id: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hotel_id: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hotel_id?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_user_roles_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
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
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
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
        Relationships: [
          {
            foreignKeyName: "restaurant_menus_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
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
          description: string | null
          floor: number
          id: string
          images: string[] | null
          price: number
          room_number: string
          status: string | null
          type: string
          updated_at: string | null
          view_type: string | null
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          floor: number
          id?: string
          images?: string[] | null
          price?: number
          room_number: string
          status?: string | null
          type: string
          updated_at?: string | null
          view_type?: string | null
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          floor?: number
          id?: string
          images?: string[] | null
          price?: number
          room_number?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          view_type?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          created_at: string | null
          description: string | null
          guest_id: string | null
          id: string
          room_id: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          guest_id?: string | null
          id?: string
          room_id?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          guest_id?: string | null
          id?: string
          room_id?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admins: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
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
      get_user_hotels: {
        Args: {
          user_id: string
        }
        Returns: {
          hotel_id: string
          role: string
        }[]
      }
      has_hotel_role: {
        Args: {
          user_id: string
          hotel_id: string
          required_role: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_hotel_admin: {
        Args: {
          user_id: string
          hotel_id: string
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: {
          user_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
