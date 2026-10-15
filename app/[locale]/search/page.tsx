import { searchProducts } from "@/features/catalog/search/queries/search-products";
import { SearchResults } from "@/features/catalog/search/components/search-results";

type SearchPageProps = {
   params: Promise<{ locale: string }>;
   searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({
   searchParams,
}: SearchPageProps) {
   const { q } = await searchParams;
   const query = q?.trim() ?? "";

   const products =
   query.length >= 2 ? await searchProducts(query) : [];

   return ( 
      <main className="container mx-auto px-4 py-8"> 
         <h1 className="text-2xl font-semibold">Search results </h1>
         {query ? (
            <p className="mt-2 text-muted-foreground">
               Results for: {query}
            </p>
         ) : (
            <p className="mt-4">
               Enter a search term to find products.
            </p>
         )}

         {query.length >= 2 && products.length === 0 && (
            <p className="mt-6">
               No products found.
            </p>
         )}

         {products.length > 0 && (
            <SearchResults products={products} />
         )}
      </main>

   );
}
