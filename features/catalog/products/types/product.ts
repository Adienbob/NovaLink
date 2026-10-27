import type { Json } from "@/app/lib/supabase/database";

export type ProductBrand = {
   id: string;
   name: string;
   slug: string;
   logo_url: string | null;
};

export type ProductCategory = {
   id: string;
   name: string;
   slug: string;
   parent_id: string | null
};

export type ProductVariant = {
   attributes: Json;
   base_price_usd: number | null;
   id: string;
   is_active: boolean;
   price: number;
   product_id: string;
   sku: string;
   stock_quantity: number;
   variant_name: string;
};

export type ProductImage = {
   id: string;
   variant_id: string | null;
   product_id: string
   url: string;
   alt_text: string | null;
   sort_order: number;
};

export type Product = {
   id: string;
   name: string;
   slug: string;
   description: string;
   base_price: number;
   seo_title: string | null;
   seo_description: string | null;
   created_at: string;
   brand: ProductBrand | null;
   category: ProductCategory | null;
   variants: ProductVariant[];
   images: ProductImage[];
};