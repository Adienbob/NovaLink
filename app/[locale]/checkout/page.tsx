import { getCheckoutData } from "@/features/checkout/queries/get-checkout-data";
import { Checkout } from "@/features/checkout/components/checkout";
import { redirect } from "next/navigation";
import { Locale } from "@/app/lib/types/general-types";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: Locale }> }) {
   const { locale } = await params;

   const data = await getCheckoutData(locale);

   if (!data) {
      redirect(`/${locale}/cart`);
   }


   return (
      <Checkout
         governorates={data.governorates}
         cartItems={data.cartItems}
         isAuthenticated={data.isAuthenticated}
         locale={locale}
      />
   );
}