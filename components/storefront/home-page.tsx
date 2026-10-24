import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPublicBrands } from "@/features/catalog/brands/actions/get-public-brands";
import { BrandsGrid } from "@/features/catalog/brands/components/brands-grid";
import { CategoriesGrid } from "@/features/catalog/categories/components/categories-grid";
import Hero from "./hero";
import { getPublicCategories } from "@/features/catalog/categories/actions/get-public-categories";
import { StoreNavigation } from "../navigation/store-navigation";
import BannersGrid from "./images-banner";

interface HomePageProps {
   locale: string;
}

export async function StorefrontHomePage({ locale }: HomePageProps) {
   const brands = await getPublicBrands();
   const categories = await getPublicCategories();

   return (
      <div className="space-y-16 pb-16">
         <StoreNavigation />
         <Hero />
         <BrandsGrid brands={brands} locale={locale} />
         <BannersGrid />
         <CategoriesGrid categories={categories} locale={locale} />
      </div>
   );
}