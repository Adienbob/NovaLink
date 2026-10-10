"use client";

type SearchSuggestionsProps = {
   suggestions: string[];
   onSelect: (suggestion: string) => void;
   isLoading?: boolean;
   query: string;
   className?: string;
};

export function SearchSuggestions({
   suggestions,
   onSelect,
   isLoading = false,
   query,
   className,
}: SearchSuggestionsProps) {
   if (query.trim().length < 2) {
      return null;
   }

   return (
      <div
         className={`absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${className ?? ""}`}
         role="listbox"
         aria-label="Search suggestions"
      >
         {isLoading ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
               Loading suggestions...
            </p>
         ) : suggestions.length > 0 ? (
            <ul className="py-1">
               {suggestions.map((suggestion) => (
                  <li key={suggestion}>
                     <button
                        type="button"
                        role="option"
                        aria-selected={false}
                        onClick={() => onSelect(suggestion)}
                        className="w-full px-4 py-3 text-start text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none"
                     >
                        {suggestion}
                     </button>
                  </li>
               ))}
            </ul>
         ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">
               No suggestions found.
            </p>
         )}
      </div>
   );
}