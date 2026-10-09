import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/features/products/queries/get-product-by-category";

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

   return (
      <main>
         <h1>Category: {slug}</h1>

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