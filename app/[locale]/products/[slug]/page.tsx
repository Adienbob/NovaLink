import { notFound } from "next/navigation";
import { getProductBySlug } from "@/features/products/queries/get-product-by-slug";
import ProductVariantSelector from "@/features/products/components/product-variant-selector";

type ProductPageProps = {
   params: Promise<{
      locale: string;
      slug: string;
   }>;
};

export default async function ProductPage({
   params,
}: ProductPageProps) {
   const { slug } = await params;

   const product = await getProductBySlug(slug);

   if (!product) {
      notFound();
   }

   return (
      <main className="mx-auto max-w-5xl space-y-6 p-6">
         <header>
         <h1 className="text-3xl font-bold">{product.name}</h1>

         <p className="mt-2 text-gray-600">{product.description}</p>
         </header>

         <section>
         <h2 className="text-xl font-semibold">Product Information</h2>

         <p>Brand: {product.brand?.name ?? "Unknown"}</p>
         <p>Category: {product.category?.name ?? "Unknown"}</p>
         <p>Base price: {product.base_price}</p>
         </section>

         <section>
         <h2 className="text-xl font-semibold">Variants</h2>

         {product.variants?.length ? (
            <ul className="list-inside list-disc">
               {product.variants.map((variant) => (
               <li key={variant.id}>
                  {variant.variant_name} — {variant.price}
                  {" — "}
                  Stock: {variant.stock_quantity}
               </li>
               ))}
            </ul>
         ) : (
            <p>No available variants.</p>
         )}
         </section>

         <section>
         <h2 className="text-xl font-semibold">Images</h2>

         {product.images?.length ? (
            <ul className="list-inside list-disc">
               {product.images.map((image) => (
               <li key={image.id}>
                  <img src={image.url} alt={image.alt_text ? image.alt_text : ""} />
                  {image.url}
                  {image.alt_text ? ` — ${image.alt_text}` : ""}
               </li>
               ))}
            </ul>
         ) : (
            <p>No images available.</p>
         )}
         </section>
         <ProductVariantSelector variants={product.variants} />
      </main>
   );
}