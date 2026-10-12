import { createContext, useContext } from "react";
import type { CartDisplayItem } from "../types/cart-item";

export type CartContextValue = {
   items: CartDisplayItem[];
   isLoading: boolean;
   addItem: (variantId: string, quantity: number) => Promise<void>;
   updateQuantity: (variantId: string, quantity: number) => Promise<void>;
   removeItem: (variantId: string) => Promise<void>;
   clearCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCartContext() {
   const context = useContext(CartContext);

   if (!context) {
      throw new Error("useCartContext must be used within CartProvider");
   }

   return context;
}