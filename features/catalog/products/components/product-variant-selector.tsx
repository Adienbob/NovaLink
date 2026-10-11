"use client";

import { useState } from "react";
import type { ProductVariant } from "@/features/products/types/product";

type ProductVariantSelectorProps = {
   variants: ProductVariant[];
};

export default function ProductVariantSelector({
   variants,
}: ProductVariantSelectorProps) {
   const [selectedVariantId, setSelectedVariantId] = useState<string>(
      variants[0]?.id ?? ""
   );

   const selectedVariant = variants.find(
      (variant) => variant.id === selectedVariantId
   );

   if (variants.length === 0) {
      return <p>No variants available.</p>;
   }

   return (
      <section>
         <h2>Choose a variant</h2>

         <div>
            {variants.map((variant) => {
               const isOutOfStock = variant.stock_quantity <= 0;

               return (
                  <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  disabled={isOutOfStock}
                  aria-pressed={selectedVariantId === variant.id}
                  >
                  {variant.variant_name}
                  {isOutOfStock ? " (Out of stock)" : ""}
                  </button>
               );
            })}
         </div>

         {selectedVariant && (
            <div>
               <p>Price: {selectedVariant.price}</p>
               <p>Stock: {selectedVariant.stock_quantity}</p>
               <p>SKU: {selectedVariant.sku}</p>
            </div>
         )}
      </section>
   );
}