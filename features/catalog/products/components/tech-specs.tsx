import { Json } from "@/app/lib/supabase/database";

type ProductTechSpecsProps = {
   specs: Json | null;
   locale: string;
};

export function ProductTechSpecs({
   specs,
   locale,
}: ProductTechSpecsProps) {
   if (!specs) return null;

   const isAr = locale === "ar";

   const labels: Record<string, { en: string; ar: string }> = {
      poe: { en: "PoE Support", ar: "دعم PoE" },
      ports: { en: "Ports", ar: "المنافذ" },
      management_type: { en: "Management Type", ar: "نوع الإدارة" },
   };

   const entries = Object.entries(specs).filter(
      ([, value]) => value !== null && value !== undefined,
   );

   if (!entries.length) return null;

   const formatValue = (key: string, value: Json | undefined) => {
      if (typeof value === "boolean") {
         return value ? (isAr ? "نعم" : "Yes") : (isAr ? "لا" : "No");
      }

      if (typeof value === "string") {
         if (key === "management_type") {
         const managementTypes: Record<string, { en: string; ar: string }> = {
            unmanaged: { en: "Unmanaged", ar: "غير مُدار" },
            managed: { en: "Managed", ar: "مُدار" },
            smart: { en: "Smart Managed", ar: "إدارة ذكية" },
         };

         const type = managementTypes[value.toLowerCase()];
         return type ? (isAr ? type.ar : type.en) : value;
         }

         return value;
      }

      if (typeof value === "number") return String(value);

      return JSON.stringify(value);
   };

   return (
      <section className="space-y-4">
         <h2 className="text-lg font-semibold text-foreground">
         {isAr ? "المواصفات التقنية" : "Technical Specifications"}
         </h2>

         <div className="overflow-hidden rounded-lg border border-border">
         <dl className="divide-y divide-border bg-surface">
            {entries.map(([key, value]) => {
               const label = labels[key];

               return (
               <div
                  key={key}
                  className="grid grid-cols-2 gap-4 px-4 py-3 text-sm"
               >
                  <dt className="font-medium text-foreground">
                     {label ? (isAr ? label.ar : label.en) : key}
                  </dt>

                  <dd className="text-secondary">
                     {formatValue(key, value)}
                  </dd>
               </div>
               );
            })}
         </dl>
         </div>
      </section>
   );
}
