
import AccountSidebar from "@/components/navigation/account-sidebar";
import type { ReactNode } from "react";

export default function AccountLayout({
   children,
}: {
   children: ReactNode;
}) {
   return (
      <div className="  mx-8 py-8">
         
         <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
         <AccountSidebar />

         <main className="min-w-0">{children}</main>
         </div>
      </div>
   );
}
