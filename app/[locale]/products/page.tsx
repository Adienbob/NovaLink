import ProductGrid from "@/components/storefront/product-grid";
import { getPublicProducts } from "@/features/catalog/products/actions/get-public-products";

type ProductsPageProps = {
   params: Promise<{
      locale: string;
   }>;
};



export default async function ProductsPage({ params }: ProductsPageProps) {
   const { locale } = await params;
   const isAr = locale === "ar";

   // جلب كافة المنتجات المتاحة من السيرفر
   // 1. استدعاء الـ Server Action
   const response = await getPublicProducts(); 

   // 2. استخراج المصفوفة وتحويل هيكلها ليطابق الـ Product Type الخاص بـ ProductGrid
   const formattedProducts = response.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      base_price: p.base_price,
      created_at: p.created_at,
      seo_title: null,
      seo_description: null,
      category: p.categories ? { id: p.categories.id, name: p.categories.name, slug: "", parent_id: null } : null,
      brand: p.brands ? { id: p.brands.id, name: p.brands.name, slug: "", logo_url: null } : null,
      variants: p.product_variants.map((v) => ({
         id: v.id,
         sku: v.sku,
         variant_name: v.variant_name,
         price: v.price,
         stock_quantity: v.stock_quantity,
         is_active: v.is_active,
         product_id: p.id,
         attributes: v.attributes,
         base_price_usd: v.base_price_usd ?? null,
      })),
      images: p.product_images.map((img) => ({
         id: img.id,
         url: img.url,
         alt_text: img.alt_text ?? null,
         sort_order: img.sort_order,
         product_id: p.id,
         variant_id: img.variant_id ?? null,
      })),
   }));

   console.log(formattedProducts)
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
            <ProductGrid products={formattedProducts} locale={locale} />
         </section>
      </main>
   );
}