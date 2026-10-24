"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CartDisplayItem } from "@/features/cart/types/cart-item";

interface CartItemRowProps {
   item: CartDisplayItem;
   locale: string;
   onUpdateQuantity?: (cartItemId: string, newQuantity: number) => void;
   onRemove?: (cartItemId: string) => void;
   isUpdating?: boolean;
}

export function CartItemRow({
   item,
   locale,
   onUpdateQuantity,
   onRemove,
   isUpdating = false,
}: CartItemRowProps) {
   const isAr = locale === "ar";
   const { variant } = item;
   const product = variant.product;

   const unitPrice = variant.price ?? 0;
   const totalPrice = unitPrice * item.quantity;

   // استخراج الصورة الأولى بحسب sort_order
   const imageUrl =
      product.images && product.images.length > 0
         ? [...product.images].sort((a, b) => a.sort_order - b.sort_order)[0]?.url
         : null;

   return (
      <div className="flex items-center gap-4 py-3 border-b border-border text-foreground">
         {/* صورة المنتج */}
         <div className="relative aspect-square w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
         {imageUrl ? (
            <Image
               src={imageUrl}
               alt={product.images[0]?.alt_text || product.name}
               fill
               className="object-cover"
               sizes="64px"
            />
         ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-secondary">
               {isAr ? "لا صورة" : "No image"}
            </div>
         )}
         </div>

         {/* تفاصيل المنتج والنوع */}
         <div className="flex-1 space-y-1">
         <h4 className="text-sm font-semibold leading-tight line-clamp-1">
            {product.name}
         </h4>
         {variant.variant_name && (
            <p className="text-xs text-secondary">{variant.variant_name}</p>
         )}
         <p className="text-xs font-mono text-secondary">
            {Number(unitPrice).toFixed(2)} SAR
         </p>
         </div>

         {/* التحكم بالكمية والإجمالي */}
         <div className="flex flex-col items-end gap-2">
         <div className="flex items-center gap-1 border border-border rounded p-0.5">
            <Button
               variant="ghost"
               size="sm"
               className="h-6 w-6 p-0 text-xs"
               disabled={item.quantity <= 1 || isUpdating}
               onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
            >
               -
            </Button>
            <span className="text-xs font-mono px-1 min-w-[1.5rem] text-center">
               {item.quantity}
            </span>
            <Button
               variant="ghost"
               size="sm"
               className="h-6 w-6 p-0 text-xs"
               disabled={isUpdating || item.quantity >= variant.stock_quantity}
               onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
            >
               +
            </Button>
         </div>

         <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono">
               {Number(totalPrice).toFixed(2)} SAR
            </span>
            <button
               type="button"
               className="text-[10px] text-destructive hover:underline"
               disabled={isUpdating}
               onClick={() => onRemove?.(item.id)}
            >
               {isAr ? "حذف" : "Remove"}
            </button>
         </div>
         </div>
      </div>
   );
}