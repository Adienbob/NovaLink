"use client";

import Link from "next/link";
import { useGuestCheckoutItems } from "../hooks/ues-guest-checkout-items";
import { CheckoutForm, type CartItemSummary, type GovernorateOption } from "./checkout-form";
import { Button } from "@/components/ui/button";

interface CheckoutProps {
  governorates: GovernorateOption[];
  cartItems: CartItemSummary[] | null; // null = ضيف
  isAuthenticated: boolean;
  locale?: string;
}

export function Checkout({ governorates, cartItems, isAuthenticated, locale = "ar" }: CheckoutProps) {
  const { items: guestItems, status } = useGuestCheckoutItems(!isAuthenticated);
  const isAr = locale === "ar";

  if (!isAuthenticated && status === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <p className="text-sm font-medium text-secondary animate-pulse">
          {isAr ? "جاري تحميل السلة..." : "Loading cart..."}
        </p>
      </div>
    );
  }

  if (!isAuthenticated && status === "error") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center p-8">
        <p className="text-sm font-medium text-destructive">
          {isAr
            ? "تعذّر تحميل السلة، برجاء إعادة المحاولة."
            : "Failed to load cart. Please try again."}
        </p>
      </div>
    );
  }

  const items = isAuthenticated ? (cartItems ?? []) : guestItems;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center p-8">
        <div className="rounded-full bg-muted p-6 text-3xl">🛒</div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            {isAr ? "السلة فارغة" : "Your cart is empty"}
          </h2>
          <p className="text-sm text-secondary">
            {isAr
              ? "يرجى إضافة منتجات إلى السلة أولاً لإتمام عملية الشراء."
              : "Please add items to your cart before proceeding to checkout."}
          </p>
        </div>
        <Button asChild className="mt-2">
          <Link href={`/${locale}`}>
            {isAr ? "العودة للتسوق" : "Return to Shop"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">
          {isAr ? "إتمام الطلب" : "Checkout"}
        </h1>
      </div>

      <CheckoutForm governorates={governorates} cartItems={items} locale={locale} />
    </section>
  );
}