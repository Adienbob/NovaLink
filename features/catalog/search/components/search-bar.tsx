"use client";

import { useEffect, useState } from "react";
import { SearchSuggestions } from "./search-suggestions";
import { useRouter } from "@/i18n/navigation";

export function SearchBar() {
   const [query, setQuery] = useState("");
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   useEffect(() => {
      const normalizedQuery = query.trim();

      if (normalizedQuery.length < 2) {
         setSuggestions([]);
         setIsLoading(false);
         setError(null);
         return;
      }

      const controller = new AbortController();

      const timeoutId = setTimeout(async () => {
         setIsLoading(true);
         setError(null);

         try {
            const response = await fetch(
               `/api/search/suggestions?q=${encodeURIComponent(normalizedQuery)}`,
               { signal: controller.signal }
            );

            if (!response.ok) {
               console.log(response)
               throw new Error("Failed to load suggestions.");
            }

            const data: { suggestions: { text: string }[] } =
               await response.json();
            
            if (!controller.signal.aborted) {
               setSuggestions(data.suggestions.map((item) => item.text));
            }
         } catch (err: unknown) {
            const isAbortError = 
               controller.signal.aborted || 
               (err instanceof Error && err.name === "AbortError") ||
               (typeof err === "object" && err !== null && "name" in err && err.name === "AbortError");
               console.log(err)
            if (isAbortError) {
               return;
            }

            setSuggestions([]);
            setError("Unable to load suggestions.");
         } finally {
            if (!controller.signal.aborted) {
               setIsLoading(false);
            }
         }
      }, 300);

      return () => {
         clearTimeout(timeoutId);
         controller.abort();
      };
   }, [query]);

   function handleSearch(searchQuery: string) {
      const normalizedQuery = searchQuery.trim();

      if (!normalizedQuery) return;

      router.push(`/search?q=${encodeURIComponent(normalizedQuery)}`);
      setSuggestions([]);
   }

   function handleSelect(suggestion: string) {
      setQuery(suggestion);
      handleSearch(suggestion);
   }

   return (
      <div className="relative w-full">
         <input
            onKeyDown={(event) => {
               if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearch(query);
               }
            }}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands, and categories..."
            autoComplete="off"
            className="h-11 w-full rounded-md border bg-background px-4 text-start text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search products"
         />

         {error ? (
            <p role="status" className="mt-2 text-sm text-destructive">
               {error}
            </p>
         ) : (
            <SearchSuggestions
               query={query}
               suggestions={suggestions}
               isLoading={isLoading}
               onSelect={handleSelect}
            />
         )}
      </div>
   );
}