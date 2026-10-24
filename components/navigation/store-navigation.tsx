import Link from "next/link";

const categories = [
   { label: "Routers", href: "/categories/routers" },
   { label: "Access Points", href: "/categories/access-points" },
   { label: "Switches", href: "/categories/switches" },
   { label: "Range Extenders", href: "/categories/range-extenders" },
];

const brands = [
   { label: "TP-Link", href: "/brands/tp-link" },
   { label: "Tenda", href: "/brands/tenda" },
   { label: "Ruijie", href: "/brands/ruijie" },
];

export function StoreNavigation() {
   return (
      <nav
         aria-label="Store navigation"
         className="w-full bg-background mb-0"
      >
         {/* Categories */}
         <div className="border-b border-border">
            <div className="mx-auto flex max-w-screen-2xl items-center gap-6 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
               {categories.map((category) => (
               <Link
                  key={category.href}
                  href={category.href}
                  className="shrink-0 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:border-primary/30 hover:bg-primary/2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
               >
                  {category.label}
               </Link>
               ))}
            </div>
         </div>
      </nav>
   );
}
