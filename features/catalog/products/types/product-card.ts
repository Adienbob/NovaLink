

export type ProductCardTypes = {
   id: string;
   name: string;
   slug: string;
   brand: {
      name: string;
   } | null;
   category: {
      name: string;
   } | null;
   images: {
      url: string;
      alt_text: string | null;
      sort_order: number;
   }[];
   variants: {
      id: string;
      price: number;
      stock_quantity: number;
      is_active: boolean;
   }[];
};
