"use client";

import Link from "next/link";
import { usePathname } from "@/i18n/navigation";

const accountLinks = [
{ label: "Overview", href: "/account" },
{ label: "Orders", href: "/account/orders" },
{ label: "Profile", href: "/account/profile" },
{ label: "Addresses", href: "/account/addresses" },
{ label: "Support", href: "/account/support" },
];

export default function AccountSidebar() {
const pathname = usePathname();

return ( 

   <aside className="h-fit rounded-xl border bg-white p-4"> <h2 className="mb-4 text-lg font-semibold">My Account</h2>

      <nav aria-label="Account navigation">
         <ul className="space-y-1">
            {accountLinks.map((link) => {
               const isActive =
                  link.href === "/account"
                     ? pathname === link.href
                     : pathname === link.href ||
                     pathname.startsWith(`${link.href}/`);

               return (
                  <li key={link.href}>
                     <Link
                     href={link.href}
                     aria-current={isActive ? "page" : undefined}
                     className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                           ? "bg-primary text-primary-foreground font-medium"
                           : "text-muted-foreground hover:bg-muted hover:text-foreground"
                     }`}
                     >
                     {link.label}
                     </Link>
                  </li>
               );
               })}
            </ul>
         </nav>
      </aside>
   );
}
