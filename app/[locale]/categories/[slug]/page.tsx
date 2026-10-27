import { notFound } from "next/navigation";
import {
   QueryClient,
   dehydrate,
   HydrationBoundary,
} from "@tanstack/react-query";

import { CategoryProducts } from "@/features/catalog/categories/components/category-products";
import { categoryProductsQueryKey } from "@/shared/queries/category-products-query-options";
import { getProductsByCategory } from "@/features/catalog/categories/queries/get-products-by-category";
import { getCategoryMetadata } from '@/features/catalog/categories/queries/get-category-metadata';
import { Metadata } from 'next';
import { baseUrl } from "@/app/lib/utils/utils";
import { getCategoryBySlug } from "@/features/catalog/categories/queries/get-category-by-slug";

type CategoryPageProps = {
   params: Promise<{
      locale: string;
      slug: string;
   }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
   const { locale, slug } = await params;

   return getCategoryMetadata({ slug, locale });
}

export default async function CategoryPage({
   params,
}: CategoryPageProps) {
   const { locale, slug } = await params;

   const products = await getProductsByCategory(slug);
   const category = await getCategoryBySlug(slug);

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
      <main className="mx-auto max-w-7xl p-4 md:p-8 space-y-6">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <CategoryProducts
               slug={slug}
               locale={locale}
               availableBrands={brands}
            />
         </HydrationBoundary>

        {/* JSON-LD Schema.org CollectionPage */}
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "CollectionPage",
                  name: locale === "ar" ? category.name_ar : category.name,
                  description:
                  locale === "ar"
                     ? category.description_ar
                     : category.description_en,
                  url: `${baseUrl}${locale === "en" ? "/en" : ""}/categories/${slug}`,
                  inLanguage: locale === "ar" ? "ar-EG" : "en-US",
                  isPartOf: {
                  "@type": "WebSite",
                  name: "Zain",
                  url: baseUrl,
                  },
               }),
            }}
         />
      </main>
   );
}