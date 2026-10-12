"use client";

import { useState } from "react";
import { ProductVariant } from "../types/product";
import { AddToCartButton } from "../../shared/components/add-to-cart-button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

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



     const { isSignedIn } = useUser();
   

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
               <AddToCartButton productVariantId={selectedVariant.id} />
            </div>
         )}

         {isSignedIn ? (
            <UserButton />
            ) : (
              <SignInButton>
                  <button className="px-4 py-2 rounded-md border border-border">
                    Sign In
                  </button>
              </SignInButton>
            )
        }
      </section>
   );
}