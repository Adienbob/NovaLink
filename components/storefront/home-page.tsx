import { getPublicBrands } from "@/features/catalog/brands/actions/get-public-brands";
import { CategoriesGrid } from "@/features/catalog/categories/components/categories-grid";
import Hero from "./hero";
import WhyChooseUs from "./why-choose-us";
import { getPublicCategories } from "@/features/catalog/categories/actions/get-public-categories";
import { StoreNavigation } from "../navigation/store-navigation";
import BannersGrid from "./images-banner";
import BuildNetworkSection from "./build-network-section";
import { getPublicProducts } from "@/features/catalog/products/actions/get-public-products";
import { Locale } from "@/app/lib/types/general-types";
import { BrandsGrid } from "@/features/catalog/brands/components/brands-grid";

interface HomePageProps {
   locale: Locale;
}

export async function StorefrontHomePage({ locale }: HomePageProps) {
   const brands = await getPublicBrands();
   const categories = await getPublicCategories();
   const productsData = await getPublicProducts({limit: 10, locale});


   return (
      <div className="space-y-2 sm:pb-4 md:pb-6 lg:pb-8">
         <StoreNavigation /> 
         <Hero />
         <BrandsGrid brands={brands} locale={locale} />
         <BuildNetworkSection products={productsData.data} locale={locale}  />
         <WhyChooseUs />
         <BannersGrid />
         <CategoriesGrid categories={categories} locale={locale} />
      </div>
   );
}