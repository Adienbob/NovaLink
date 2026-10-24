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
      <div className="relative">
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
            className="h-12 w-full rounded-xl border border-input bg-background ps-11 pe-4 text-start text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground/80 hover:border-ring/50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:ring-offset-1"
            aria-label="Search products"
         />

         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
         >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
         </svg>
      </div>

      {error ? (
         <p
            role="status"
            className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
         >
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