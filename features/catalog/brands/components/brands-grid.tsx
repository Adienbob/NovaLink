import Image from "next/image";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

interface BrandsGridProps {
  brands: Brand[];
  locale?: string;
}

export function BrandsGrid({
  brands,
  locale = "en",
}: BrandsGridProps) {
  const isArabic = locale === "ar";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8"
      aria-labelledby="featured-brands-heading"
    >
      {brands.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="text-sm font-medium text-foreground">
            {isArabic
              ? "لا توجد علامات تجارية متاحة حاليًا"
              : "No brands available right now"}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {isArabic
              ? "يرجى العودة لاحقًا لاستكشاف العلامات التجارية."
              : "Please check back later to explore our brands."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 items-center gap-x-3 gap-y-2 sm:grid-cols-4 sm:gap-x-4 md:grid-cols-6 lg:grid-cols-8">
          {brands.map((brand) => (
            <Link
          key={brand.id}
          href={`/${locale}/brands/${brand.slug}`}
          aria-label={brand.name}
          className="group flex h-16 items-center justify-center rounded-lg p-2 transition-all duration-200 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-[72px]"
        >
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-b from-slate-300 from-0% via-slate-100 via-75% to-white to-100% p-2">    
          {brand.logo_url ? (
            <Image
              src={brand.logo_url}
              alt={brand.name}
              width={120}
              height={60}
              sizes="(max-width: 640px) 100px, 120px"
              className="h-full w-full max-w-[110px] object-contain"
            />
          ) : (
            <span className="truncate text-xs font-semibold text-slate-700">
              {brand.name}
            </span>
          )}
          </div>
        </Link>
          ))}
        </div>
      )}
    </section>
  );
}
