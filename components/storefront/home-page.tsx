import { getPublicBrands } from "@/features/catalog/brands/actions/get-public-brands";
import { BrandsGrid } from "@/features/catalog/brands/components/brands-grid";
import { CategoriesGrid } from "@/features/catalog/categories/components/categories-grid";
import Hero from "./hero";
import { getPublicCategories } from "@/features/catalog/categories/actions/get-public-categories";
import { StoreNavigation } from "../navigation/store-navigation";
import BannersGrid from "./images-banner";
import BuildNetworkSection from "./build-network-section";
import { getPublicProducts } from "@/features/catalog/products/actions/get-public-products";

interface HomePageProps {
   locale: string;
}

export async function StorefrontHomePage({ locale }: HomePageProps) {
   const brands = await getPublicBrands();
   const categories = await getPublicCategories();
   const productsData = await getPublicProducts({limit: 4});


   return (
      <div className="space-y-16 pb-16">
         <StoreNavigation />
         <Hero />
         <BuildNetworkSection products={productsData.products} locale={locale}  />
         <BrandsGrid brands={brands} locale={locale} />
         <BannersGrid />
         <CategoriesGrid categories={categories} locale={locale} />
      </div>
   );
}