type ProductKeyFeaturesProps = {
   features: string[] | null;
};

export function ProductKeyFeatures({ features }: ProductKeyFeaturesProps) {
   if (!features?.length) return null;

   return (
      <section className="space-y-4">
         <h2 className="text-xl font-semibold">
         Key Features
         </h2>

         <ul className="grid gap-3 sm:grid-cols-2">
         {features.map((feature, index) => (
            <li
               key={`${index}-${feature}`}
               className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
            >
               <span
               aria-hidden="true"
               className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
               />
               <span>{feature}</span>
            </li>
         ))}
         </ul>
      </section>
   );
}
