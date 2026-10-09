export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      addresses: {
        Row: {
          apartment: string | null
          area: string
          building: string | null
          city: string
          created_at: string
          floor: string | null
          governorate_id: string
          id: string
          is_default: boolean
          label: string | null
          landmark: string | null
          notes: string | null
          phone: string
          recipient_name: string
          street: string
          updated_at: string
          user_id: string
        }
        Insert: {
          apartment?: string | null
          area: string
          building?: string | null
          city: string
          created_at?: string
          floor?: string | null
          governorate_id: string
          id?: string
          is_default?: boolean
          label?: string | null
          landmark?: string | null
          notes?: string | null
          phone: string
          recipient_name: string
          street: string
          updated_at?: string
          user_id: string
        }
        Update: {
          apartment?: string | null
          area?: string
          building?: string | null
          city?: string
          created_at?: string
          floor?: string | null
          governorate_id?: string
          id?: string
          is_default?: boolean
          label?: string | null
          landmark?: string | null
          notes?: string | null
          phone?: string
          recipient_name?: string
          street?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_governorate_id_fkey"
            columns: ["governorate_id"]
            isOneToOne: false
            referencedRelation: "governorates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          id: string
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          id?: string
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_variant_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_variant_id: string
          quantity: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_variant_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      governorates: {
        Row: {
          estimated_days_max: number
          estimated_days_min: number
          id: string
          name_ar: string
          name_en: string
          shipping_fee: number
        }
        Insert: {
          estimated_days_max: number
          estimated_days_min: number
          id?: string
          name_ar: string
          name_en: string
          shipping_fee: number
        }
        Update: {
          estimated_days_max?: number
          estimated_days_min?: number
          id?: string
          name_ar?: string
          name_en?: string
          shipping_fee?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          order_id: string
          product_name: string
          product_variant_id: string | null
          quantity: number
          unit_price: number
          variant_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          line_total: number
          order_id: string
          product_name: string
          product_variant_id?: string | null
          quantity: number
          unit_price: number
          variant_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          order_id?: string
          product_name?: string
          product_variant_id?: string | null
          quantity?: number
          unit_price?: number
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          created_at: string
          id: string
          notes: string | null
          payment_method: string
          shipping_fee: number
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method: string
          shipping_fee?: number
          status?: string
          subtotal: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          payment_method?: string
          shipping_fee?: number
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          provider: string
          provider_transaction_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          provider: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          provider?: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          id: string
          product_id: string
          sort_order: number
          url: string
          variant_id: string | null
        }
        Insert: {
          alt_text?: string | null
          id?: string
          product_id: string
          sort_order?: number
          url: string
          variant_id?: string | null
        }
        Update: {
          alt_text?: string | null
          id?: string
          product_id?: string
          sort_order?: number
          url?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          base_price_usd: number | null
          id: string
          is_active: boolean
          price: number
          product_id: string
          sku: string
          stock_quantity: number
          variant_name: string
        }
        Insert: {
          attributes?: Json
          base_price_usd?: number | null
          id?: string
          is_active?: boolean
          price: number
          product_id: string
          sku: string
          stock_quantity?: number
          variant_name: string
        }
        Update: {
          attributes?: Json
          base_price_usd?: number | null
          id?: string
          is_active?: boolean
          price?: number
          product_id?: string
          sku?: string
          stock_quantity?: number
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          brand_id: string | null
          category_id: string | null
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          base_price: number
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          clerk_deleted_at: string | null
          clerk_id: string
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"] | null
        }
        Insert: {
          clerk_deleted_at?: string | null
          clerk_id: string
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"] | null
        }
        Update: {
          clerk_deleted_at?: string | null
          clerk_id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_stock: {
        Args: { p_quantity: number; p_variant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      order_status:
        | "pending_confirmation"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "returned"
        | "return_requested"
      payment_method: "cod" | "paymob" | "fawry"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      staff_role: "viewer" | "delivery" | "admin" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending_confirmation",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "return_requested",
      ],
      payment_method: ["cod", "paymob", "fawry"],
      payment_status: ["pending", "paid", "failed", "refunded"],
      staff_role: ["viewer", "delivery", "admin", "owner"],
    },
  },
} as const
