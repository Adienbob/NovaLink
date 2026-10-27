import { notFound } from "next/navigation";
import {
   QueryClient,
   dehydrate,
   HydrationBoundary,
} from "@tanstack/react-query";

import { Metadata } from 'next';
import { getProductsByBrand } from "@/features/catalog/brands/queries/get-products-by-brand";
import { BrandProducts } from "@/features/catalog/brands/components/brand-products";
import { brandProductsQueryKey } from "@/shared/queries/brand-products-query-options";
import { getBrandMetadata } from "@/features/catalog/brands/queries/get-brand-metadata";
import { getBrandsBySlug } from "@/features/catalog/brands/queries/get-brand-by-slug";
import { baseUrl } from "@/app/lib/utils/utils";

type BrandPageProps = {
   params: Promise<{
      locale: string;
      slug: string;
   }>;
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
   const { locale, slug } = await params;

   return getBrandMetadata({ slug, locale });
}

export default async function BrandPage({
   params,
}: BrandPageProps) {
   const { locale, slug } = await params;

   const products = await getProductsByBrand(slug);
   const brand = await getBrandsBySlug(slug)

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
                  slug: product.category!.slug,
               },
            ]),
      ).values(),
   );

   return (
      <main className="mx-auto max-w-7xl p-4 md:p-8 space-y-6">
         <HydrationBoundary state={dehydrate(queryClient)}>
            <BrandProducts
               slug={slug}
               locale={locale}
               availableCategories={category}
            />
         </HydrationBoundary>

         {/* JSON-LD Schema.org CollectionPage */}
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "CollectionPage",
                  name: locale === "ar" ? brand.name_ar : brand.name,
                  description:
                  locale === "ar"
                     ? brand.description_ar
                     : brand.description_en,
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

