"use client";

import { useEffect, useState } from "react";
import { getGuestCart } from "@/features/cart/lib/guest-cart-storage";
import { getGuestCartDetails } from "@/features/cart/lib/get-guest-cart-details";
import type { CartItemSummary } from "../components/checkout-form";

type Status = "loading" | "ready" | "error";

export function useGuestCheckoutItems(enabled: boolean) {
   const [items, setItems] = useState<CartItemSummary[]>([]);
   const [status, setStatus] = useState<Status>("loading");

   

   useEffect(() => {
      if (!enabled) return;

      let cancelled = false;
      const stored = getGuestCart();

      if (stored.length === 0) {
         setItems([]);
         setStatus("ready");
         return;
      }
      
         console.log("1. stored guest cart:", stored);

      getGuestCartDetails(stored.map((i) => i.variantId))
         .then((details) => {
            if (cancelled) return;

            const merged = stored.flatMap((item): CartItemSummary[] => {
               const variant = details.find((d) => d.id === item.variantId);
               if (!variant) return []; 
               return [
                  {
                     variantId: variant.id,
                     productName: variant.product.name,
                     variantName: variant.variant_name,
                     quantity: item.quantity,
                     price: Number(variant.price),
                  },
               ];
            });

            setItems(merged);
            setStatus("ready");
         })
         .catch((err) => {
            console.error(err);
            if (!cancelled) setStatus("error");
         });

      return () => {
         cancelled = true;
      };
   }, [enabled]);

   

   return { items, status };
}