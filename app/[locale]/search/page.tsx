import { searchProducts } from "@/features/catalog/search/queries/search-products";
import ProductGrid from "@/components/storefront/product-grid";
import { ProductFilters } from "@/features/catalog/shared/filters/components/product-filters";

type SearchPageProps = {
   params: Promise<{ locale: string }>;
   searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({
   searchParams,
   params,
}: SearchPageProps) {
   const { locale } = await params
   const { q } = await searchParams;
   const query = q?.trim() ?? "";

   const products =
   query.length >= 2 ? await searchProducts(query) : [];

   return ( 
      <main className="mx-auto max-w-7xl p-4 md:p-8 space-y-6">
         {/* Page Header */}
         <div className="mb-8 space-y-3">
            <div className="space-y-2">
               <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Search results
               </h1>

         {query ? (
            <p className="text-sm text-muted-foreground sm:text-base">
               Results for:{" "}
               <span className="font-semibold text-foreground">
                  &quot;{query}&quot;
               </span>
            </p>
         ) : (
            <p className="text-sm text-muted-foreground sm:text-base">
               Enter a search term to find products.
            </p>
         )}
      </div>

      {query.length >= 2 && products.length === 0 && (
         <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-foreground">
               No products found
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
               Try a different search term or adjust your filters.
            </p>
         </div>
      )}

         </div>

      {/* Search Content */}
      {query.length >= 2 && products.length > 0 && ( <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
      {/* Filters Sidebar */} <aside className="min-w-0"> <ProductFilters /> </aside>

         {/* Products */}
         <section className="min-w-0">
            <ProductGrid locale={locale} products={products} />
         </section>
      </div>

      )}

      </main>
   );
}
