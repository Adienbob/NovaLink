import * as React from "react";
import { ProductCard } from "./product-card";
import { Product } from "@/features/catalog/products/types/product";

interface ProductGridProps {
   products: Product[];
   locale: string;
   onAddToCart?: (productId: string, variantId?: string) => void;
   loadingProductId?: string | null;
}

export function ProductGrid({
   products,
   locale,
   onAddToCart,
   loadingProductId,
}: ProductGridProps) {
   const isAr = locale === "ar";

   if (!products || products.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-border bg-surface">
         <p className="text-sm text-secondary">
            {isAr
               ? "لا توجد منتجات متاحة حالياً."
               : "No products available at the moment."}
         </p>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
         {products.map((product) => (
            <ProductCard
               key={product.id}
               product={product}
               locale={locale}
            />
         ))}
      </div>
   );
}