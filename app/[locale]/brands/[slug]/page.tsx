import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByBrand } from "@/features/catalog/brands/queries/get-products-by-brand";

type BrandPageProps = {
   params: Promise<{
      locale: string;
      slug: string;
   }>;
};

export default async function BrandPage({
   params,
}: BrandPageProps) {
   const { locale, slug } = await params;

   const products = await getProductsByBrand(slug);

   if (products.length === 0) {
      notFound();
   }
   
   console.log(
   products.map((product) => ({
      name: product.name,
      variants: product.variants.map((variant) => ({
         name: variant.variant_name,
         is_active: variant.is_active,
      })),
   }))
);
   return (
      <main>
         <h1>Brand: {slug}</h1>

         <section>
            {products.map((product) => (
               <article key={product.id}>
                  <h2>
                     <Link href={`/${locale}/products/${product.slug}`}>
                        {product.name}
                     </Link>
                  </h2>

                  <p>Brand: {product.brand?.name ?? "Unknown"}</p>
                  <p>Price: {product.base_price}</p>

                  {product.images[0] && (
                     <p>Image: {product.images[0].url}</p>
                  )}
               </article>
            ))}
         </section>
      </main>
   );
}
