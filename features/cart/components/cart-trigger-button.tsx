"use client";

import Link from "next/link";
import { useCartContext } from "@/features/cart/context/cart-context";

interface CartTriggerButtonProps {
   locale: string;
}

export function CartTriggerButton({ locale }: CartTriggerButtonProps) {
   const { items } = useCartContext();

   // حساب مجموع عدد القطع الكلي
   const totalQuantity = (items || []).reduce((sum, item) => sum + item.quantity, 0);

   return (
      <Link
         href={`/${locale}/cart`}
         className="relative flex items-center justify-center py-2 px-1 text-foreground hover:opacity-80 transition-opacity"
         aria-label="Cart"
      >
         {/* PLACEHOLDER: ضع أيقونة السلة هنا لاحقاً */}
         <span className="text-sm font-semibold">🛒</span>

         {/* شارة عدد العناصر */}
         {totalQuantity > 0 && (
         <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-mono font-bold text-primary-foreground">
            {totalQuantity}
         </span>
         )}
      </Link>
   );
}