"use client";

import { useGuestCheckoutItems } from "../hooks/ues-guest-checkout-items";
import { CheckoutForm, type CartItemSummary, type GovernorateOption } from "./checkout-form";

interface CheckoutProps {
   governorates: GovernorateOption[];
   cartItems: CartItemSummary[] | null; // null = ضيف
   isAuthenticated: boolean;
   locale?: string;
}

export function Checkout({ governorates, cartItems, isAuthenticated, locale }: CheckoutProps) {
   const { items: guestItems, status } = useGuestCheckoutItems(!isAuthenticated);

   if (!isAuthenticated && status === "loading") {
      return <p className="p-4 text-center">جاري تحميل السلة...</p>;
   }

   if (!isAuthenticated && status === "error") {
      return <p className="p-4 text-center">تعذّر تحميل السلة، برجاء إعادة المحاولة.</p>;
   }

   const items = isAuthenticated ? (cartItems ?? []) : guestItems;

   if (items.length === 0) {
      return <p className="p-4 text-center">السلة فارغة</p>;
   }

   return <CheckoutForm governorates={governorates} cartItems={items} locale={locale} />;
}