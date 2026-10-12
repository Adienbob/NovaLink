export type CartItem = {
   variantId: string;
   quantity: number;
};

export type CartDisplayItem = {
   id: string;
   product_variant_id: string;
   quantity: number;
   variant: {
      id: string;
      sku: string;
      variant_name: string | null;
      attributes: Record<string, unknown>;
      price: number;
      stock_quantity: number;
      is_active: boolean;
      product: {
         id: string;
         name: string;
         slug: string;
         is_active: boolean;
         brand: {
            name: string;
            slug: string;
         } | null;
         images: {
            url: string;
            alt_text: string | null;
            sort_order: number;
         }[];
      };
   };
};
