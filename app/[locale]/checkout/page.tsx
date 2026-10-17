import { getCheckoutData } from "@/features/checkout/queries/get-checkout-data";
import { Checkout } from "@/features/checkout/components/checkout";
import { redirect } from "next/navigation";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params;

   const data = await getCheckoutData();

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