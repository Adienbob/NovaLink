import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { Locale } from "@/app/lib/types/general-types";

interface Category {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  parent?: {
    name: string;
  } | null;
}

interface CategoriesGridProps {
  categories: Category[];
  locale?: Locale;
}

export function CategoriesGrid({
  categories,
  locale = "en",
}: CategoriesGridProps) {
  const isRtl = locale === "ar";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto max-w-7xl px-4 py-0 sm:px-6 sm:py-5 lg:px-8"
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
  {categories.map((cat) => (
    <Link
      key={cat.id}
      href={`/${locale}/categories/${cat.slug}`}
      className="group flex min-h-[100px] items-center gap-3 overflow-hidden rounded-lg border border-border bg-card p-3 transition-colors duration-200 hover:border-primary/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Category Image */}
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/50 p-2">
        {cat.logo_url ? (
          <Image
            src={cat.logo_url}
            alt={cat.name}
            fill
            sizes="64px"
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <Package
            className="h-8 w-8 text-muted-foreground"
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* Category Info */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {cat.name}
        </h3>

        {cat.parent && (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {cat.parent.name}
          </p>
        )}
      </div>

      {/* Arrow */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:text-primary group-hover:translate-x-[-2px]"
      >
        <path
          d={
            isRtl
              ? "M19 12H5m0 0 7-7m-7 7 7 7"
              : "M5 12h14m0 0-7-7m7 7-7 7"
          }
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  ))}
</div>
      )}
    </section>
  );
}
