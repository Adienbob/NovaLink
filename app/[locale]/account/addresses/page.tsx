import { getAddresses, getGovernorates } from "@/features/addresses/queries/get-addresses"; // or wherever getAddresses is located
import AddressList from "@/features/addresses/components/addresses-list";

export default async function AddressesPage({ params }: { params: Promise<{ locale: string }> }) {
   const { locale } = await params
   const [addresses, governorates] = await Promise.all([
      getAddresses(),
      getGovernorates(),
   ]);

   return (
      <div className="mx-auto">
         <AddressList addresses={addresses} governorates={governorates} locale={locale} />
      </div>
   );
}