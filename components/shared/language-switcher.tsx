"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";
import { Button } from "../ui/button";

export function LanguageSwitcher() {
   const locale = useLocale();
   const pathname = usePathname();
   const router = useRouter();

   const nextLocale = locale === "ar" ? "en" : "ar";

   function switchLanguage() {
      router.replace(pathname, { locale: nextLocale });
   }

   return (
      <Button
         type="button"
         onClick={switchLanguage}
         aria-label={locale === "ar" ? "Switch to English" : "التغيير إلى العربية"}
         className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
         <Languages className="h-4 w-4 text-secondary" strokeWidth={1.8} />
         <span>{nextLocale === "ar" ? "عربي" : "EN"}</span>
      </Button>
   );
}