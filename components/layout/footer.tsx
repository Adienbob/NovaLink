import Link from "next/link";

interface FooterProps {
   locale?: string;
}

export function Footer({ locale = "en" }: FooterProps) {
   return (
      <footer className="w-full border-t border-border bg-surface text-foreground mt-auto">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="space-y-4 md:col-span-1">
               <Link href={`/${locale}`} className="text-xl font-bold tracking-tight flex items-center gap-2">
               <span className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm shadow-sm">
                  Z
               </span>
               <span>Zain</span>
               </Link>
               <p className="text-xs text-secondary leading-relaxed">
               Your ultimate destination for high-quality electronics, appliances, and modern lifestyle products.
               </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
               Quick Links
               </h3>
               <ul className="space-y-2 text-xs text-secondary">
               <li>
                  <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                     Store Catalog
                  </Link>
               </li>
               <li>
                  <Link href={`/${locale}/categories`} className="hover:text-foreground transition-colors">
                     Categories
                  </Link>
               </li>
               <li>
                  <Link href={`/${locale}/cart`} className="hover:text-foreground transition-colors">
                     Shopping Cart
                  </Link>
               </li>
               </ul>
            </div>

            {/* Customer Support */}
            <div className="space-y-3">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
               Support
               </h3>
               <ul className="space-y-2 text-xs text-secondary">
               <li>
                  <Link href={`/${locale}/account/orders`} className="hover:text-foreground transition-colors">
                     Track Orders
                  </Link>
               </li>
               <li>
                  <span className="cursor-pointer hover:text-foreground transition-colors">
                     Shipping & Returns
                  </span>
               </li>
               <li>
                  <span className="cursor-pointer hover:text-foreground transition-colors">
                     Contact Us
                  </span>
               </li>
               </ul>
            </div>

            {/* Newsletter / Legal */}
            <div className="space-y-3">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
               Legal & Privacy
               </h3>
               <ul className="space-y-2 text-xs text-secondary">
               <li>
                  <span className="cursor-pointer hover:text-foreground transition-colors">
                     Privacy Policy
                  </span>
               </li>
               <li>
                  <span className="cursor-pointer hover:text-foreground transition-colors">
                     Terms of Service
                  </span>
               </li>
               </ul>
            </div>

         </div>

         {/* Bottom Bar */}
         <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary gap-4">
            <p>© {new Date().getFullYear()} Zain E-Commerce. All rights reserved.</p>
            <div className="flex items-center gap-4">
               <span>Secure Payments</span>
               <span>•</span>
               <span>Fast Delivery</span>
            </div>
         </div>
         </div>
      </footer>
   );
}