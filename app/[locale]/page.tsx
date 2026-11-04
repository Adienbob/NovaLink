import { StorefrontHomePage } from "@/components/storefront/home-page";
import { Locale } from "../lib/types/general-types";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <StorefrontHomePage locale={locale} />;
}