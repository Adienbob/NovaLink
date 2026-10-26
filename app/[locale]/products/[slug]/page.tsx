import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/features/catalog/products/queries/get-products-by-slug";
import ProductVariantSelector from "@/features/catalog/products/components/product-variant-selector";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import RelatedProducts from "@/features/catalog/products/components/related-products";
import { getRelatedProducts } from "@/features/catalog/products/queries/get-related-products";

type ProductPageProps = {
   params: Promise<{
      locale: string;
      slug: string;
   }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
   const { locale, slug } = await params;
   const isAr = locale === "ar";

   console.log(slug)

   const product = await getProductBySlug(slug);

   
   if (!product || !product.category) {
      notFound();
   }
   const relatedProductsData = await getRelatedProducts({categoryId: product.category.id, currentProductId: product.id, brandId: product.brand?.id, limit: 4})

   console.log("product", product)

   // ترتيب الصور بحسب sort_order
   const sortedImages = product.images
      ? [...product.images].sort((a, b) => a.sort_order - b.sort_order)
      : [];

   const mainImage = sortedImages[0]?.url;
   const defaultVariant = product.variants?.[0];
   const displayPrice = defaultVariant?.price ?? product.base_price;
   const inStock = defaultVariant ? defaultVariant.stock_quantity > 0 : false;


   return (
      <main className="mx-auto max-w-7xl p-4 md:p-8 space-y-8 text-foreground">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
         {/* قسم معارض الصور */}
         <section className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
               {mainImage.length > 1 ? 
               
               <div>
                  <Image 
                     src={`/${mainImage}.webp`}
                     fill
                     alt="s"
                  />
               </div> 
               :  
               <div className="flex h-full w-full items-center justify-center text-sm text-secondary">
                  {isAr ? "لا توجد صورة متاحة" : "No image available"}
               </div> 
               
               }
               {!inStock && (
               <div className="absolute top-4 start-4 z-10">
                  <Badge variant="destructive" className="px-3 py-1 text-xs">
                     {isAr ? "نفدت الكمية" : "Out of Stock"}
                  </Badge>
               </div>
               )}
            </div>

            {/* المصغرات (Thumbnails) */}
            {sortedImages.length > 1 && (
               <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
               {sortedImages.map((img) => (
                  <div
                     key={img.id}
                     className="relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted cursor-pointer hover:border-primary transition-colors"
                  >
                     <Image
                     src={product.images[0].url}
                     alt={img.alt_text || product.name}
                     fill
                     className="object-cover"
                     sizes="80px"
                     />
                  </div>
               ))}
               </div>
            )}
         </section>

         {/* قسم تفاصيل المنتج والشراء */}
         <section className="flex flex-col space-y-6 justify-between">
            <div className="space-y-4">
               {/* الفئة والعلامة التجارية */}
               <div className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider">
               {product.brand && (
                  <span>{product.brand.name}</span>
               )}
               {product.brand && product.category && <span>•</span>}
               {product.category && (
                  <span>{product.category.name}</span>
               )}
               </div>

               {/* الاسم والسعر */}
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
               {product.name}
               </h1>

               <div className="flex items-baseline gap-3">
               <span className="text-3xl font-extrabold font-mono text-foreground">
                  {Number(displayPrice).toFixed(2)} SAR
               </span>
               {product.base_price > displayPrice && (
                  <span className="text-base text-secondary line-through font-mono">
                     {Number(product.base_price).toFixed(2)} SAR
                  </span>
               )}
               </div>

               {/* الوصف */}
               <p className="text-sm text-secondary leading-relaxed pt-2 border-t border-border">
               {product.description}
               </p>
            </div>

            {/* محدد الأشكال والمتغيرات (Variant Selector) */}
            <Card className="border-border bg-surface shadow-sm">
               <CardContent className="p-4 space-y-4">
               <h2 className="flex items-center gap-2 border-b border-border pb-3 text-base font-bold tracking-tight text-foreground"> <span className="h-5 w-1 rounded-full bg-primary" aria-hidden="true" /> {isAr ? "الخيارات المتاحة" : "Available Options"} </h2>
               <ProductVariantSelector variants={product.variants} />
               </CardContent>
            </Card>
         </section>
         <div className="col-span-2">

            <RelatedProducts products={relatedProductsData} />
         </div>
         </div>
      </main>
   );
}