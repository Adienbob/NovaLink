"use client";

import { useState } from "react";
import { ProductVariant } from "../types/product";
import { AddToCartButton } from "../../shared/components/add-to-cart-button";

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
return ( <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
No variants available. </p>
);
}

   return ( 
      <section className="space-y-5"> <div className="space-y-1"> 
            <h2 className="text-base font-semibold text-foreground">
            Choose a variant 
            </h2> 
            <p className="text-sm text-muted-foreground">
            Select the option that suits your needs. 
            </p> 
         </div>

         <div className="flex flex-wrap gap-3">
            {variants.map((variant) => {
               const isOutOfStock = variant.stock_quantity <= 0;
               const isSelected = selectedVariantId === variant.id;

               return (
                  <button
                     key={variant.id}
                     type="button"
                     onClick={() => setSelectedVariantId(variant.id)}
                     disabled={isOutOfStock}
                     aria-pressed={isSelected}
                     className={`
                        relative min-w-24 rounded-lg border px-4 py-3 text-sm font-medium
                        transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-ring focus-visible:ring-offset-2
                        ${
                           isSelected
                              ? "border-primary bg-primary/5 text-primary shadow-sm"
                              : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted/40"
                        }
                        ${
                           isOutOfStock
                              ? "cursor-not-allowed opacity-50"
                              : "cursor-pointer"
                        }
                     `}
                  >
                     <span>{variant.variant_name}</span>

                     {isSelected && !isOutOfStock && (
                        <span
                           aria-hidden="true"
                           className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
                        >
                           ✓
                        </span>
                     )}

                     {isOutOfStock && (
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                           Out of stock
                        </span>
                     )}
                  </button>
               );
            })}
         </div>

         {selectedVariant && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
               <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                     <p className="text-sm text-muted-foreground">
                        Selected option
                     </p>
                     <p className="font-semibold text-foreground">
                        {selectedVariant.variant_name}
                     </p>
                  </div>

                  <div className="text-end">
                     <p className="text-2xl font-bold tracking-tight text-foreground">
                        {selectedVariant.price}
                     </p>
                     <p
                        className={`mt-1 text-sm font-medium ${
                           selectedVariant.stock_quantity > 0
                              ? "text-emerald-600"
                              : "text-destructive"
                        }`}
                     >
                        {selectedVariant.stock_quantity > 0
                           ? "In stock"
                           : "Out of stock"}
                     </p>
                  </div>
               </div>

               <div className="flex flex-wrap justify-between border-t border-border pt-3 text-sm">
                  <p className="text-muted-foreground">
                     SKU:{" "}
                     <span className="font-medium text-foreground">
                        {selectedVariant.sku}
                     </span>
                  </p>

                  <p className="text-muted-foreground">
                     Available quantity:{" "}
                     <span className="font-medium text-foreground">
                        {selectedVariant.stock_quantity}
                     </span>
                  </p>
               </div>

               <div className="pt-1">
                  <AddToCartButton
                     productVariantId={selectedVariant.id}
                  />
               </div>
            </div>
         )}
      </section>

   );
}
