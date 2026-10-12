import type { CartItem } from "../types/cart-item";

const GUEST_CART_KEY = "zain-guest-cart";

export function getGuestCart(): CartItem[] {
   if (typeof window === "undefined") {
      return [];
   }

   try {
      const storedCart = localStorage.getItem(GUEST_CART_KEY);

      if (!storedCart) {
         return [];
      }

      const parsedCart: unknown = JSON.parse(storedCart);

      if (!Array.isArray(parsedCart)) {
         return [];
      }

      return parsedCart.filter(
         (item): item is CartItem =>
            typeof item === "object" &&
            item !== null &&
            "variantId" in item &&
            typeof item.variantId === "string" &&
            item.variantId.length > 0 &&
            "quantity" in item &&
            typeof item.quantity === "number" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0,
      );
   } catch {
      return [];
   }
}

export function saveGuestCart(items: CartItem[]): void {
   if (typeof window === "undefined") {
      return;
   }

   try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
   } catch (error) {
      console.error("Failed to save guest cart:", error);
   }
}

export function clearGuestCart(): void {
   if (typeof window === "undefined") {
      return;
   }

   try {
      localStorage.removeItem(GUEST_CART_KEY);
   } catch (error) {
      console.error("Failed to clear guest cart:", error);
   }
}