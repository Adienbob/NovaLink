import Link from "next/link";
import type { Product } from "@/features/products/types/product";

type ProductListProps = {
   products: Product[];
   locale: string;
};

export default function ProductList({
   products,
   locale,
}: ProductListProps) {
   if (products.length === 0) {
      return <p>No products found.</p>;
   }

   return (
      <ul>
         {products.map((product) => (
            <li key={product.id}>
               <Link href={`/${locale}/products/${product.slug}`}>
                  {product.name}
               </Link>

               <p>Brand: {product.brand?.name ?? "Unknown"}</p>
               <p>Price: {product.base_price}</p>
            </li>
         ))}
      </ul>
   );
}