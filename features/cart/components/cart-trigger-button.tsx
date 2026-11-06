"use client";

import Link from "next/link";
import { useCartContext } from "@/features/cart/context/cart-context";
import { ShoppingCart } from "lucide-react";
import { Locale } from "@/app/lib/types/general-types";
interface CartTriggerButtonProps {
   locale: Locale;
}

export function CartTriggerButton({ locale }: CartTriggerButtonProps) {
   const { items } = useCartContext();

   // حساب مجموع عدد القطع الكلي
   const totalQuantity = (items || []).reduce((sum, item) => sum + item.quantity, 0);

   return (
      <Link
         href={`/${locale}/cart`}
         className="relative flex items-center justify-center rounded-md h-9 w-9 transition-colors hover:bg-muted text-foreground"
         
         aria-label="Cart"
      >
         {/* PLACEHOLDER: ضع أيقونة السلة هنا لاحقاً */}
         <ShoppingCart className="h-5 w-5" strokeWidth={1.8} />
         {/* شارة عدد العناصر */}
         {totalQuantity > 0 && (
         <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[11px] font-mono font-bold text-primary-foreground">
            {totalQuantity}
         </span>
         )}
      </Link>
   );
}