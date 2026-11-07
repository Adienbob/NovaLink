"use client";
import Image from "next/image";
import { Package } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("CategoriesGrid");

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className="mx-auto max-w-7xl px-4 py-0 sm:px-6 sm:py-5 lg:px-8"
    >
      {/* Section Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {t("description")}
          </p>
        </div>
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
            {t("empty.title")}
          </h3>

          <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
            {t("empty.description")}
          </p>
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex w-30 flex-col items-center gap-3
                overflow-hidden rounded-lg
                border border-border
                bg-card p-3 
                shadow-sm
                transition-all duration-200
                hover:border-primary/50
                hover:shadow-md
                hover:-translate-y-0.5
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2"
              >
              {/* Category Image */}
              <div className="relative flex h-22 w-22 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted p-2">
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
              <div className="flex h-10 w-full items-center justify-center">
                <h3 className="text-center text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                  {cat.name}
                </h3>
              </div>
              
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
