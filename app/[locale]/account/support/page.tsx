import Link from "next/link";

const supportOptions = [
   {
      title: "Call Us",
      description: "Talk directly with our support team.",
      value: "+20 100 000 0000",
      href: "tel:+201000000000",
      icon: "📞",
      action: "Call Now",
   },
   {
      title: "Email Us",
      description: "Send us your questions or inquiries.",
      value: "[support@zain.eg](mailto:support@zain.eg)",
      href: "mailto:support@zain.eg",
      icon: "✉️",
      action: "Send Email",
   },
   {
      title: "WhatsApp",
      description: "Chat with us for quick assistance.",
      value: "Chat with our team",
      href: "https://wa.me/201000000000",
      icon: "💬",
      action: "Chat Now",
   },
];

export default function SupportPage() {
return ( 
   <div className="space-y-8"> 
      <div> 
         <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Customer Support 
         </h1> 
         <p className="mt-2 text-sm text-muted-foreground">
            Need help? Contact our team through any of the channels below. 
         </p> 
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
         {supportOptions.map((option) => (
            <div
            key={option.title}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
               {option.icon}
            </div>

            <h2 className="mt-5 text-lg font-bold text-card-foreground">
               {option.title}
            </h2>

            <p className="mt-2 min-h-10 text-sm leading-6 text-muted-foreground">
               {option.description}
            </p>

            <p className="mt-5 text-sm font-semibold text-foreground" dir="ltr">
               {option.value}
            </p>

            <Link
               href={option.href}
               target={option.href.startsWith("https://") ? "_blank" : undefined}
               rel={option.href.startsWith("https://") ? "noopener noreferrer" : undefined}
               className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
               {option.action}
            </Link>
            </div>
         ))}
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-center">
         <h2 className="font-semibold text-foreground">
            We're here to help!
         </h2>
         <p className="mt-2 text-sm text-muted-foreground">
            Our team will be happy to assist you with your orders and product inquiries.
         </p>
      </div>
   </div>

   );
}
