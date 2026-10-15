import { notFound } from "next/navigation";
import {
   QueryClient,
   dehydrate,
   HydrationBoundary,
} from "@tanstack/react-query";

import { getProductsByBrand } from "@/features/catalog/brands/queries/get-products-by-brand";
import { BrandProducts } from "@/features/catalog/brands/components/brand-products";
import { brandProductsQueryKey } from "@/shared/queries/brand-products-query-options";
type CategoryPageProps = {
   params: Promise<{
      locale: string;
      slug: string;
   }>;
};

export default async function BrandPage({
   params,
}: CategoryPageProps) {
   const { locale, slug } = await params;

   const products = await getProductsByBrand(slug);

   if (products.length === 0) {
      notFound();
   }

   const queryClient = new QueryClient();

   queryClient.setQueryData(
      brandProductsQueryKey(slug),
      products,
   );
         

   const category = Array.from(
      new Map(
         products
            .filter((product) => product.category)
            .map((product) => [
               product.category!.id,
               {
                  id: product.category!.id,
                  name: product.category!.name,
               },
            ]),
      ).values(),
   );

   return (
      <main>
         <h1>Brand: {slug}</h1>

         <HydrationBoundary state={dehydrate(queryClient)}>
            <BrandProducts
               slug={slug}
               locale={locale}
               availableCategories={category}
            />
         </HydrationBoundary>
      </main>
   );
}

