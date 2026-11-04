import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { getCart } from "@/features/cart/actions/get-cart";
import type { CartItemSummary } from "../components/checkout-form";
import { Locale } from "@/app/lib/types/general-types";

export async function getCheckoutData(locale: Locale) {
   const { userId: clerkUserId } = await auth();

   const { data: governorates } = await supabaseAdmin
      .from("governorates")
      .select("id, name_ar, name_en, shipping_fee")
      .in("name_en", ["Cairo", "Giza"]);

   const formattedGovs = (governorates ?? []).map((g) => ({
      id: g.id,
      nameAr: g.name_ar,
      nameEn: g.name_en,
      shippingFee: Number(g.shipping_fee),
   }));

   if (clerkUserId) {
      const userCart = await getCart(locale);

      const cartItems: CartItemSummary[] = userCart.map((item) => ({
         variantId: item.product_variant_id,
         productName: item.variant.product.name,
         variantName: item.variant.variant_name,
         quantity: item.quantity,
         price: Number(item.variant.price),
      }));

      return {
         governorates: formattedGovs,
         cartItems,
         isAuthenticated: true as const,
      };
   }

   return {
      governorates: formattedGovs,
      cartItems: null,
      isAuthenticated: false as const,
   };
}