"use client";

import { useAuth } from "@clerk/nextjs";
import {
   useCallback,
   useEffect,
   useReducer,
   useState,
   type ReactNode,
} from "react";

import { CartContext } from "../context/cart-context";
import {
   cartReducer,
   initialCartState,
} from "../lib/cart-reducer";

import {
   getGuestCart,
   saveGuestCart,
   clearGuestCart,
} from "../lib/guest-cart-storage";

import { getCart } from "../actions/get-cart";
import { addToCart } from "../actions/add-to-cart";
import { updateCartQuantity } from "../actions/update-cart-quantity";
import { removeFromCart } from "../actions/remove-from-cart";
import { clearCart as clearServerCart } from "../actions/clear-cart";
import { mergeGuestCart } from "../actions/merge-guest-cart";

import type { CartDisplayItem, CartItem } from "../types/cart-item";
import { getGuestCartDetails } from "../lib/get-guest-cart-details";

type CartProviderProps = {
   children: ReactNode;
};

async function getGuestDisplayItems(
   guestItems: CartItem[],
): Promise<CartDisplayItem[]> {
   if (guestItems.length === 0) {
      return [];
   }

   const variants = await getGuestCartDetails(
      guestItems.map((item) => item.variantId),
   );

   const guestItemsByVariantId = new Map(
      guestItems.map((item) => [item.variantId, item]),
   );

   return variants.flatMap((variant) => {
      const guestItem = guestItemsByVariantId.get(variant.id);

      if (!guestItem) {
         return [];
      }

      return [
         {
            id: variant.id,
            product_variant_id: variant.id,
            quantity: guestItem.quantity,
            variant,
         },
      ];
   }) as CartDisplayItem[];
}

async function getServerDisplayItems(): Promise<CartDisplayItem[]> {
   const items = await getCart();

   return items.map((item) => ({
      id: item.id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      variant: item.variant,
   })) as CartDisplayItem[];
}

export function CartProvider({ children }: CartProviderProps) {
   const { isLoaded, isSignedIn, userId } = useAuth();

   const [state, dispatch] = useReducer(
      cartReducer,
      initialCartState,
   );

   const [isLoading, setIsLoading] = useState(true);

   // Load the correct cart based on the authentication state.
   useEffect(() => {
      if (!isLoaded) {
         return;
      }

      let cancelled = false;

      async function loadCart() {
         setIsLoading(true);

         try {
            if (isSignedIn) {
               const guestItems = getGuestCart();

               if (guestItems.length > 0) {
                  await mergeGuestCart({
                     items: guestItems.map((item) => ({
                        variantId: item.variantId,
                        quantity: item.quantity,
                     })),
                  });

                  if (cancelled) {
                     return;
                  }

                  const items = await getServerDisplayItems();

                  if (cancelled) {
                     return;
                  }

                  dispatch({
                     type: "SET_CART",
                     payload: items,
                  });

                  clearGuestCart();
               } else {
                  const items = await getServerDisplayItems();

                  if (cancelled) {
                     return;
                  }

                  dispatch({
                     type: "SET_CART",
                     payload: items,
                  });
               }
            } else {
               const guestItems = getGuestCart();
               const displayItems =
                  await getGuestDisplayItems(guestItems);

               if (cancelled) {
                  return;
               }

               dispatch({
                  type: "SET_CART",
                  payload: displayItems,
               });
            }
         } catch (error) {
            if (!cancelled) {
               console.error("Failed to load cart:", error);
            }
         } finally {
            if (!cancelled) {
               setIsLoading(false);
            }
         }
      }

      void loadCart();

      return () => {
         cancelled = true;
      };
   }, [isLoaded, isSignedIn, userId]);

   // Add an item to the cart.
   const addItem = useCallback(
      async (variantId: string, quantity: number) => {
         if (!isLoaded) {
            throw new Error("AUTH_NOT_LOADED");
         }

         if (
            !variantId ||
            !Number.isInteger(quantity) ||
            quantity < 1
         ) {
            throw new Error("INVALID_CART_INPUT");
         }

         if (isSignedIn) {
            await addToCart({
               variantId,
               quantity,
            });

            const items = await getServerDisplayItems();

            dispatch({
               type: "SET_CART",
               payload: items,
            });

            return;
         }

         const currentItems = getGuestCart();

         const existingItem = currentItems.find(
            (item) => item.variantId === variantId,
         );

         const nextItems = existingItem
            ? currentItems.map((item) =>
                 item.variantId === variantId
                    ? {
                         ...item,
                         quantity: item.quantity + quantity,
                      }
                    : item,
              )
            : [
                 ...currentItems,
                 {
                    variantId,
                    quantity,
                 },
              ];

         saveGuestCart(nextItems);

         const displayItems =
            await getGuestDisplayItems(nextItems);

         dispatch({
            type: "SET_CART",
            payload: displayItems,
         });
      },
      [isLoaded, isSignedIn],
   );

   // Update an item's quantity.
   const updateQuantity = useCallback(
      async (variantId: string, quantity: number) => {
         if (
            !variantId ||
            !Number.isInteger(quantity) ||
            quantity < 1
         ) {
            throw new Error("INVALID_CART_INPUT");
         }

         if (isSignedIn) {
            await updateCartQuantity({
               variantId,
               quantity,
            });

            const items = await getServerDisplayItems();

            dispatch({
               type: "SET_CART",
               payload: items,
            });

            return;
         }

         const currentItems = getGuestCart();

         const exists = currentItems.some(
            (item) => item.variantId === variantId,
         );

         if (!exists) {
            throw new Error("CART_ITEM_NOT_FOUND");
         }

         const nextItems = currentItems.map((item) =>
            item.variantId === variantId
               ? {
                    ...item,
                    quantity,
                 }
               : item,
         );

         saveGuestCart(nextItems);

         const displayItems =
            await getGuestDisplayItems(nextItems);

         dispatch({
            type: "SET_CART",
            payload: displayItems,
         });
      },
      [isSignedIn],
   );

   // Remove an item from the cart.
   const removeItem = useCallback(
      async (variantId: string) => {
         if (!variantId) {
            throw new Error("INVALID_CART_INPUT");
         }

         if (isSignedIn) {
            await removeFromCart({
               variantId,
            });

            const items = await getServerDisplayItems();

            dispatch({
               type: "SET_CART",
               payload: items,
            });

            return;
         }

         const currentItems = getGuestCart();

         const nextItems = currentItems.filter(
            (item) => item.variantId !== variantId,
         );

         saveGuestCart(nextItems);

         const displayItems =
            await getGuestDisplayItems(nextItems);

         dispatch({
            type: "SET_CART",
            payload: displayItems,
         });
      },
      [isSignedIn],
   );

   // Clear the entire cart.
   const clearCart = useCallback(async () => {
      if (isSignedIn) {
         await clearServerCart();
      } else {
         clearGuestCart();
      }

      dispatch({
         type: "CLEAR_CART",
      });
   }, [isSignedIn]);

   return (
      <CartContext.Provider
         value={{
            items: state.items,
            isLoading,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
         }}
      >
         {children}
      </CartContext.Provider>
   );
}