import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent?: {
    name: string;
  } | null;
}

interface CategoriesGridProps {
  categories: Category[];
  locale?: string;
}

export function CategoriesGrid({
  categories,
  locale = "en",
}: CategoriesGridProps) {
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      {/* Section Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Explore
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Explore Categories
          </h2>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Find the right networking equipment with our organized product
            categories.
          </p>
        </div>

        {categories.length > 0 && (
          <span className="hidden shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </span>
        )}
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-primary"
            >
              <path
                d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5v-4ZM13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5v-4ZM4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5v-4ZM13 14.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="text-base font-semibold text-foreground">
            No categories available
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
            Categories will appear here once they become available.
          </p>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/${locale}/categories/${cat.slug}`}
              className="group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
            >
              {/* Subtle decorative accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-primary/[0.04] transition-transform duration-500 group-hover:scale-150"
              />

              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                    {cat.parent ? "Subcategory" : "Main category"}
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background text-muted-foreground transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4"
                    >
                      <path
                        d={isRtl ? "M19 12H5m0 0 7-7m-7 7 7 7" : "M5 12h14m0 0-7-7m7 7-7 7"}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-xl">
                  {cat.name}
                </h3>

                {cat.parent && (
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Part of{" "}
                    <span className="font-medium text-foreground/80">
                      {cat.parent.name}
                    </span>
                  </p>
                )}
              </div>

              <div className="relative mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                <span className="text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
                  Browse products
                </span>

                <span className="text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
