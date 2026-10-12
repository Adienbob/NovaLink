"use client";

import { useState } from "react";
import { useCartContext } from "@/features/cart/context/cart-context";

type AddToCartButtonProps = {
   productVariantId: string;
};

export function AddToCartButton({
   productVariantId,
}: AddToCartButtonProps) {
   const { addItem } = useCartContext();
   const [isAdding, setIsAdding] = useState(false);
   const [message, setMessage] = useState("");

   async function handleAddToCart() {
      try {
         setIsAdding(true);
         setMessage("");

         await addItem(productVariantId, 1);

         setMessage("Added to cart successfully.");
      } catch {
         setMessage("Failed to add product to cart.");
      } finally {
         setIsAdding(false);
      }
   }

   return (
      <div>
         <button
         type="button"
         onClick={handleAddToCart}
         disabled={isAdding}
         >
         {isAdding ? "Adding..." : "Add to Cart"}
         </button>

         {message && <p role="status">{message}</p>}
      </div>
   );
}