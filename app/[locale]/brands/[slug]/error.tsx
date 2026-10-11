"use client";

import { useEffect } from "react";

type CategoryErrorProps = {
   error: Error & { digest?: string };
   reset: () => void;
};

export default function CategoryError({
   error,
   reset,
}: CategoryErrorProps) {
   useEffect(() => {
      console.error("Category page error:", error);
   }, [error]);

   return (
      <main>
         <h2>Something went wrong</h2>
         <p>We couldn't load these brands products.</p>
         <button type="button" onClick={reset}>
            Try again
         </button>
      </main>
   );
}