import { StorefrontHomePage } from "@/components/storefront/home-page";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  return <StorefrontHomePage locale={locale} />;
}