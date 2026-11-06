import {
   BadgeCheck,
   ShieldCheck,
   Headset,
   Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";

const features = [
   {
      key: "genuineProducts",
      icon: BadgeCheck,
   },
   {
      key: "warranty",
      icon: ShieldCheck,
   },
   {
      key: "expertSupport",
      icon: Headset,
   },
   {
      key: "delivery",
      icon: Truck,
   },
] as const;

export default function WhyChooseUs() {
   const t = useTranslations("WhyChooseUs");

   return (
      <section className=" my-5 bg-muted/50 p-5 sm:p-6">
         <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:divide-x lg:divide-x-reverse">
         {features.map(({ key, icon: Icon }) => (
            <div
               key={key}
               className="flex items-start gap-3 lg:px-5 first:lg:ps-0 last:lg:pe-0"
            >
               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
               <Icon className="h-5 w-5" strokeWidth={1.8} />
               </div>

               <div className="min-w-0">
               <h3 className="text-sm font-semibold text-foreground">
                  {t(`${key}.title`)}
               </h3>

               <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {t(`${key}.description`)}
               </p>
               </div>
            </div>
         ))}
         </div>
      </section>
   );
}