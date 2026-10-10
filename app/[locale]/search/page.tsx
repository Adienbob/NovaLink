import { searchProducts } from "@/features/search/queries/search-products";

type SearchPageProps = {
   params: Promise<{ locale: string }>;
   searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({
   searchParams,
}: SearchPageProps) {
   const { q } = await searchParams;
   const query = q?.trim() ?? "";

   const products = query.length >= 2
      ? await searchProducts(query)
      : [];

   return (
      <main className="container mx-auto px-4 py-8">
         <h1 className="text-2xl font-semibold">
            Search results
         </h1>

         {query ? (
            <p className="mt-2 text-muted-foreground">
               Results for: {query}
            </p>
         ) : (
            <p className="mt-4">
               Enter a search term to find products.
            </p>
         )}

         {query.length >= 2 && (
            <p className="mt-4">
               {products.length} products found
            </p>
         )}

         {query.length >= 2 && products.length === 0 && (
            <p className="mt-6">
               No products found.
            </p>
         )}

         <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
               <article
                  key={product.id}
                  className="rounded-lg border p-4"
               >
                  <h2 className="font-medium">
                     {product.name}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                     {product.brands?.name ?? "Unknown brand"}
                  </p>

                  <p className="mt-2 text-sm">
                     {product.categories?.name ?? "Uncategorized"}
                  </p>

                  <p className="mt-3 font-semibold">
                     {Number(product.base_price).toLocaleString("en-US")} EGP
                  </p>
               </article>
            ))}
         </div>
      </main>
   );
}