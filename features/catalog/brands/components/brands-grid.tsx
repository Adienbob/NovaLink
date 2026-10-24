import Image from "next/image";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  slug: string;
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
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="featured-brands-heading"
    >
      <div className="mb-7 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-6 w-1 rounded-full bg-primary"
            />

            <h2
              id="featured-brands-heading"
              className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
            >
              {isArabic ? "العلامات التجارية المميزة" : "Featured Brands"}
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {isArabic
              ? "اكتشف منتجات أفضل العلامات التجارية في مجال الشبكات والتكنولوجيا."
              : "Discover products from trusted brands in networking and technology."}
          </p>
        </div>

        {brands.length > 0 && (
          <span className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {brands.length}
            <span className="ms-1">
              {isArabic ? "علامة تجارية" : "brands"}
            </span>
          </span>
        )}
      </div>

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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/${locale}/brands/${brand.slug}`}
              className="group relative flex min-h-28 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-border bg-card p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              
              <Image src={`/${brand.name.toLocaleLowerCase()}.webp`} alt="" width={150} height={75} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
