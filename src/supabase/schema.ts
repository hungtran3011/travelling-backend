export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accom_amenities: {
        Row: {
          accom_id: string | null
          amenity_id: string | null
          created_at: string
          id: string
          price: number | null
        }
        Insert: {
          accom_id?: string | null
          amenity_id?: string | null
          created_at?: string
          id?: string
          price?: number | null
        }
        Update: {
          accom_id?: string | null
          amenity_id?: string | null
          created_at?: string
          id?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "accom_amenities_accom_id_fkey"
            columns: ["accom_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accom_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
        ]
      }
      accom_units: {
        Row: {
          accommodation_id: string
          created_at: string
          id: string
          is_available: boolean | null
          max_occupancy: number | null
          name: string | null
          price_unit_text: string | null
          type: string | null
          unit_price: number | null
        }
        Insert: {
          accommodation_id?: string
          created_at?: string
          id?: string
          is_available?: boolean | null
          max_occupancy?: number | null
          name?: string | null
          price_unit_text?: string | null
          type?: string | null
          unit_price?: number | null
        }
        Update: {
          accommodation_id?: string
          created_at?: string
          id?: string
          is_available?: boolean | null
          max_occupancy?: number | null
          name?: string | null
          price_unit_text?: string | null
          type?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "accom_units_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      accommodations: {
        Row: {
          contact_mail: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          rating: number | null
          type: string | null
          website: string | null
        }
        Insert: {
          contact_mail?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          rating?: number | null
          type?: string | null
          website?: string | null
        }
        Update: {
          contact_mail?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          rating?: number | null
          type?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      amenities: {
        Row: {
          amenity_name: string | null
          created_at: string
          description: string | null
          id: string
        }
        Insert: {
          amenity_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
        }
        Update: {
          amenity_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
        }
        Relationships: []
      }
      media_places: {
        Row: {
          created_at: string
          id: string
          media_url: string | null
          places_id: string
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          media_url?: string | null
          places_id?: string
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          media_url?: string | null
          places_id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_places_places_id_fkey"
            columns: ["places_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          email: string | null
          id: string
          location: string | null
          name: string | null
          phone: string | null
          place_types: string | null
          rating: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          place_types?: string | null
          rating?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          place_types?: string | null
          rating?: string | null
          website?: string | null
        }
        Relationships: []
      }
      restaurant_menu_item: {
        Row: {
          created_at: string
          id: string
          name: string | null
          restaurant_id: string | null
          type: string | null
          unit_price: number | null
          unit_text: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          restaurant_id?: string | null
          type?: string | null
          unit_price?: number | null
          unit_text?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          restaurant_id?: string | null
          type?: string | null
          unit_price?: number | null
          unit_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_menu_item_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          created_at: string
          deposit: number | null
          id: string
          is_available: boolean | null
          restaurant_id: string | null
          seating_capacity: number | null
          table_name: string | null
        }
        Insert: {
          created_at?: string
          deposit?: number | null
          id?: string
          is_available?: boolean | null
          restaurant_id?: string | null
          seating_capacity?: number | null
          table_name?: string | null
        }
        Update: {
          created_at?: string
          deposit?: number | null
          id?: string
          is_available?: boolean | null
          restaurant_id?: string | null
          seating_capacity?: number | null
          table_name?: string | null
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
          created_at: string
          cuisine_type: string | null
          id: string
        }
        Insert: {
          created_at?: string
          cuisine_type?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          cuisine_type?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      sightseeing_places: {
        Row: {
          created_at: string
          id: string
          operating_hours: string | null
          ticket_price: number | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          operating_hours?: string | null
          ticket_price?: number | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          operating_hours?: string | null
          ticket_price?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sightseeing_places_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      sightseeing_services: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          id: number
          name: string | null
          place_id: string | null
          price: number | null
          price_unit: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: number
          name?: string | null
          place_id?: string | null
          price?: number | null
          price_unit?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: number
          name?: string | null
          place_id?: string | null
          price?: number | null
          price_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sightseeing_services_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "sightseeing_places"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          birthday: string | null
          country: string | null
          email: string | null
          full_name: string | null
          gender: number | null
          id: string
          phone: string | null
          province: string | null
        }
        Insert: {
          avatar_url?: string | null
          birthday?: string | null
          country?: string | null
          email?: string | null
          full_name?: string | null
          gender?: number | null
          id?: string
          phone?: string | null
          province?: string | null
        }
        Update: {
          avatar_url?: string | null
          birthday?: string | null
          country?: string | null
          email?: string | null
          full_name?: string | null
          gender?: number | null
          id?: string
          phone?: string | null
          province?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
