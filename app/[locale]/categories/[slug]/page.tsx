import { notFound } from "next/navigation";
import {
   QueryClient,
   dehydrate,
   HydrationBoundary,
} from "@tanstack/react-query";

import { CategoryProducts } from "@/features/catalog/categories/components/category-products";
import { categoryProductsQueryKey } from "@/shared/queries/category-products-query-options";
import { getProductsByCategory } from "@/features/catalog/categories/queries/get-products-by-category";

type CategoryPageProps = {
   params: Promise<{
      locale: string;
      slug: string;
   }>;
};

export default async function CategoryPage({
   params,
}: CategoryPageProps) {
   const { locale, slug } = await params;

   const products = await getProductsByCategory(slug);

   if (products.length === 0) {
      notFound();
   }

   const queryClient = new QueryClient();

   queryClient.setQueryData(
      categoryProductsQueryKey(slug),
      products,
   );

   const brands = Array.from(
      new Map(
         products
            .filter((product) => product.brand)
            .map((product) => [
               product.brand!.id,
               {
                  id: product.brand!.id,
                  name: product.brand!.name,
                  slug: product.brand!.slug,
               },
            ]),
      ).values(),
   );

   return (
      <main>
         <h1>Category: {slug}</h1>

         <HydrationBoundary state={dehydrate(queryClient)}>
            <CategoryProducts
               slug={slug}
               locale={locale}
               availableBrands={brands}
            />
         </HydrationBoundary>
      </main>
   );
}