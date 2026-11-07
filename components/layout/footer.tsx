"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Locale } from "@/app/lib/types/general-types";
interface FooterProps {
   locale?: Locale;
}

export function Footer({ locale = "en" }: FooterProps) {
   const t = useTranslations("Footer");

   return (
      <footer className="w-full border-t border-border bg-surface text-foreground mt-auto">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="space-y-4 md:col-span-1">
               <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <Image 
                     src={`/logo.png`}
                     alt=""
                     width={85}
                     height={85}
                  />
               </Link>
               <p className="text-xs text-secondary leading-relaxed">
                  {t("brandDescription")}
               </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
               {t("quickLinks")}
               </h3>
               <ul className="space-y-2 text-xs text-secondary">
               <li>
                  <Link href={`/`} className="hover:text-foreground transition-colors">
                     {t("links.catalog")}
                  </Link>
               </li>
               <li>
                  <Link href="/categories" className="hover:text-foreground transition-colors">
                     {t("links.categories")}
                  </Link>
               </li>
               <li>
                  <Link href="/cart" className="hover:text-foreground transition-colors">
                     {t("links.cart")}
                  </Link>
               </li>
               </ul>
            </div>

            {/* Customer Support */}
            <div className="space-y-3">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {t("support")}
               </h3>
               <ul className="space-y-2 text-xs text-secondary">
               <li>
                  <Link href="/account/orders" className="hover:text-foreground transition-colors">
                     {t("links.trackOrders")}
                  </Link>
               </li>
               <li>
                  <span className="cursor-pointer hover:text-foreground transition-colors">
                     {t("links.shipping")}
                  </span>
               </li>
               <li>
                  <span className="cursor-pointer hover:text-foreground transition-colors">
                     {t("links.contact")}
                  </span>
               </li>
               </ul>
            </div>

            {/* Newsletter / Legal */}
            <div className="space-y-3">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {t("legal")}
               </h3>
               <ul className="space-y-2 text-xs text-secondary">
               <li>
                  <span className="cursor-pointer hover:text-foreground transition-colors">
                     {t("links.privacy")}
                  </span>
               </li>
               <li>
                  <span className="cursor-pointer hover:text-foreground transition-colors">
                     {t("links.terms")}
                  </span>
               </li>
               </ul>
            </div>

         </div>

         {/* Bottom Bar */}
         <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary gap-4">
            <p>{t("copyright", { year: new Date().getFullYear() })}</p>
            <div className="flex items-center gap-4">
               <span>{t("securePayments")}</span>
               <span>•</span>
               <span>{t("fastDelivery")}</span>
            </div>
         </div>
         </div>
      </footer>
   );
}