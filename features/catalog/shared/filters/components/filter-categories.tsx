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
      <section className="space-y-3"> <h3 className="font-medium">Categories</h3>

         <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search categories..."
            aria-label="Search categories"
            className="w-full rounded-md border px-3 py-2 text-sm"
         />

         <div className="max-h-52 space-y-2 overflow-y-auto">
            {filteredCategories.map((category) => (
               <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
               >
                  <input
                     type="checkbox"
                     checked={selectedCategories.includes(category.id)}
                     onChange={() => toggleCategory(category.id)}
                  />
                  <span>{category.name}</span>
               </label>
            ))}

            {filteredCategories.length === 0 && (
               <p className="text-sm text-muted-foreground">
                  No categories found.
               </p>
            )}
         </div>
      </section>
   );
}
