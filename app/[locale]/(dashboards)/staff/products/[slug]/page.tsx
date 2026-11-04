import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server"; // Clerk Standard path
import { supabaseAdmin } from "@/app/lib/supabase/server";
import { ProductDetailsView } from "@/features/dashboards/staff/products/components/product-details-view";
import { Locale } from "@/app/lib/types/general-types";

interface PageProps {
   params: Promise<{
      locale: Locale;
      slug: string;
   }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
   const { slug } = await params;

   const { data: product, error } = await supabaseAdmin
      .from("products")
      .select(`
         *,
         product_variants (
         *,
         product_images (*)
         ),
         product_images (*)
      `)
      .eq("slug", slug)
      .single();

   if (error || !product) {
      notFound();
   }

   const { sessionClaims } = await auth();
   const userRole = (sessionClaims as any)?.metadata?.role;
   // Determine if user can perform actions. Actions are also protected by requireRole on server.
   const canManage = ["admin", "owner"].includes(userRole);

   const variants = product.product_variants || [];
   
   // Get product-level images (variant_id is null) ordered by sort_order
   const productImages = (product.product_images || [])
      .filter((img: any) => img.variant_id === null)
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

   return (
      <ProductDetailsView 
         product={product}
         variants={variants}
         images={productImages}
         canManage={canManage}
      />
   );
}