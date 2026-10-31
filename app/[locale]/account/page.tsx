import Link from "next/link";

const quickLinks = [
   {
      title: "My Orders",
      description: "Track your orders and view order history.",
      href: "/account/orders",
   },
   {
      title: "My Profile",
      description: "Manage your personal information.",
      href: "/account/profile",
   },
   {
      title: "My Addresses",
      description: "Manage your shipping addresses.",
      href: "/account/addresses",
   },
   {
   title: "Support",
   description: "Get help with your orders or account.",
   href: "/account/support",
   },
];

export default function AccountOverviewPage() {
   return ( 
      <div className="space-y-8"> <section> 
         <h1 className="text-2xl font-bold">My Account</h1> 
         <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Manage your account and orders from here. 
         </p>
         </section>

         <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
               <p className="text-sm text-muted-foreground">Total Orders</p>
               <p className="mt-3 text-3xl font-bold">—</p>
               <Link
               href="/account/orders"
               className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
               >
               View orders
               </Link>
            </div>

            <div className="rounded-xl border bg-card p-5">
               <p className="text-sm text-muted-foreground">Account Settings</p>
               <p className="mt-3 text-lg font-semibold">Personal Information</p>
               <Link
               href="/account/profile"
               className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
               >
               Manage profile
               </Link>
            </div>
         </section>

         <section>
            <h2 className="mb-4 text-lg font-semibold">Quick Links</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               {quickLinks.map((item) => (
               <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-muted/40"
               >
                  <h3 className="font-semibold group-hover:text-primary">
                     {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                     {item.description}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium">
                     Open section →
                  </span>
               </Link>
               ))}
            </div>
         </section>
      </div>
   );
}
