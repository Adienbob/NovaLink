import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateProductForm } from "@/features/dashboards/staff/products/components/create-product-form";

export default function NewProductPage() {
   return (
      <div className="space-y-6 p-6 max-w-4xl mx-auto">

         <CreateProductForm />
      </div>
   );
}