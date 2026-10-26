"use client";

import { useMemo, useState } from "react";

type CategoryOption = {
   id: string;
   name: string;
};

type FilterCategoriesProps = {
   categories: CategoryOption[];
   selectedCategories: string[];
   onChange: (categories: string[]) => void;
};

export function FilterCategories({
   categories,
   selectedCategories,
   onChange,
   }: FilterCategoriesProps) {
   const [search, setSearch] = useState("");

   const filteredCategories = useMemo(() =>
      categories.filter((category) =>
      category.name
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
   ),
      [categories, search],
   );

   function toggleCategory(categoryId: string) {
      const isSelected = selectedCategories.includes(categoryId);
         onChange(
            isSelected
               ? selectedCategories.filter((id) => id !== categoryId)
               : [...selectedCategories, categoryId],
         );
   }

   return (
      <section className="space-y-4">
         <h3 className="text-sm font-semibold text-foreground">
            Categories
         </h3>

         <div className="relative">
            <input
               type="search"
               value={search}
               onChange={(event) => setSearch(event.target.value)}
               placeholder="Search categories..."
               aria-label="Search categories"
               className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
         </div>

         <div className="max-h-56 space-y-1 overflow-y-auto pe-1">
            {filteredCategories.map((category) => {
               const isSelected = selectedCategories.includes(category.id);

               return (
                  <label
                     key={category.id}
                     className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-colors ${
                        isSelected
                           ? "bg-primary/5 text-primary"
                           : "text-foreground hover:bg-muted/70"
                     }`}
                  >
                     <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategory(category.id)}
                        className="size-4 shrink-0 cursor-pointer rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                     />

                     <span className="min-w-0 flex-1 break-words">
                        {category.name}
                     </span>
                  </label>
               );
            })}

            {filteredCategories.length === 0 && (
               <p className="rounded-lg border border-dashed border-border px-3 py-5 text-center text-sm text-muted-foreground">
                  No categories found.
               </p>
            )}
         </div>
      </section>
   );

}
