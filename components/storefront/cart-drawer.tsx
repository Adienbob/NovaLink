"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "./cart-item-row";
import { CartDisplayItem } from "@/features/cart/types/cart-item";

interface CartDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   items: CartDisplayItem[];
   locale: string;
   onUpdateQuantity?: (cartItemId: string, newQuantity: number) => void;
   onRemoveItem?: (cartItemId: string) => void;
   onCheckout?: () => void;
   isPending?: boolean;
}

export function CartDrawer({
   isOpen,
   onClose,
   items,
   locale,
   onUpdateQuantity,
   onRemoveItem,
   onCheckout,
   isPending = false,
}: CartDrawerProps) {
   const isAr = locale === "ar";

   if (!isOpen) return null;

   const subtotal = items.reduce((acc, item) => {
      const price = item.variant.price ?? 0;
      return acc + price * item.quantity;
   }, 0);

   return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
         <div className="w-full max-w-md bg-surface border-s border-border h-full flex flex-col justify-between p-4 md:p-6 shadow-xl text-foreground">
         {/* Header */}
         <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-lg font-bold">
               {isAr ? "سلة التسوق" : "Shopping Cart"} ({items.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
               ✕
            </Button>
         </div>

         {/* List of Items */}
         <div className="flex-1 overflow-y-auto my-4 space-y-1">
            {items.length === 0 ? (
               <div className="flex h-full items-center justify-center text-center text-sm text-secondary">
               {isAr ? "السلة فارغة حالياً" : "Your cart is currently empty"}
               </div>
            ) : (
               items.map((item) => (
               <CartItemRow
                  key={item.id}
                  item={item}
                  locale={locale}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                  isUpdating={isPending}
               />
               ))
            )}
         </div>

         {/* Footer & Checkout */}
         <div className="border-t border-border pt-4 space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold">
               <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
               <span className="font-mono text-base">{Number(subtotal).toFixed(2)} SAR</span>
            </div>

            <Button
               className="w-full h-10 font-semibold text-sm"
               disabled={items.length === 0 || isPending}
               onClick={onCheckout}
            >
               {isAr ? "المتابعة لإتمام الطلب" : "Proceed to Checkout"}
            </Button>
         </div>
         </div>
      </div>
   );
}