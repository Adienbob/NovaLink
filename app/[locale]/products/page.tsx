import ProductGrid from "@/components/storefront/product-grid";
import { getPublicProducts } from "@/features/catalog/products/actions/get-public-products";

type ProductsPageProps = {
   params: Promise<{
      locale: string;
   }>;
};

import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
   return {
      title: 'بحث المنتجات | Zain',
      robots: {
         index: false,
         follow: true, 
      },
   };
}



export default async function ProductsPage({ params }: ProductsPageProps) {
   const { locale } = await params;
   const isAr = locale === "ar";

   // جلب كافة المنتجات المتاحة من السيرفر
   // 1. استدعاء الـ Server Action
   const response = await getPublicProducts(); 

   return (
      <main className="mx-auto max-w-7xl p-4 md:p-8 space-y-6">
         {/* الهيكل الرأسي للصفحة */}
         <header className="flex flex-col gap-2 border-b border-border pb-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
               {isAr ? "جميع المنتجات" : "All Products"}
            </h1>
            <p className="text-sm text-secondary">
               {isAr
                  ? "استعرض تشكيلة المنتجات المتاحة في المتجر"
                  : "Browse our complete catalog of available products"}
            </p>
         </header>

         {/* شبكة عرض المنتجات */}
         <section>
            <ProductGrid products={response.data} locale={locale} />
         </section>
      </main>
   );
}