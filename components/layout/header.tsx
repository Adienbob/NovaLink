import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartTriggerButton } from "@/features/cart/components/cart-trigger-button";
import { SearchBar } from "@/features/catalog/search/components/search-bar";
import { Phone } from "lucide-react";
import { Locale } from "@/app/lib/types/general-types";
import { LanguageSwitcher } from "../shared/language-switcher";
import Image from "next/image";

interface HeaderProps {
   locale?: Locale;
   cartItemCount?: number;
   userRole?: "admin" | "owner" | "viewer" | "delivery" | null;
}

export function Header({ locale = "en", cartItemCount = 0, userRole }: HeaderProps) {
   const isStaff = userRole && ["admin", "owner", "viewer", "delivery"].includes(userRole);

   return (
      <header className="sticky top-0 z-50  w-full border-b border-border bg-surface/80 backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:p-6 md:py-8 lg:py-10 h-16 flex items-center justify-between">
         
            {/* Logo / Brand */}
            <div className="flex items-center gap-8">
               <Link href={`/${locale}`} className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Image 
                     src={`/logo.png`}
                     alt=""
                     width={85}
                     height={85}
                  />
               </Link>
            </div>

            <div className="w-[40%]">
               <SearchBar />
            </div>

            {/* Actions / Right Side */}
            <div className="flex items-center gap-3">
               <LanguageSwitcher />

               <Link
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact us on WhatsApp"
                  title="Contact us on WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
                  >
                  <Phone className="h-4 w-4" />
               </Link>
               
               {/* Cart Trigger */}
               <CartTriggerButton locale={locale} />

               {/* Account / Auth */}
               <Link href={`/${locale}/account`}>
                  <Button variant="outline" size="sm" className="h-9 px-3 border-border bg-surface text-foreground hover:bg-muted flex items-center gap-1.5">
                  {/* User SVG Icon */}
                  <svg className="h-4 w-4 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                     <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="text-xs font-medium">Account</span>
                  </Button>
               </Link>

            </div>
         </div>
      </header>
   );
}