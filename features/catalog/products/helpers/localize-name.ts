type Locale = "ar" | "en";

export function localizeName<T extends { name_en: string; name_ar: string | null }>(
   row: T,
   locale: Locale
) {
   const { name_en, name_ar, ...rest } = row;
   return { ...rest, name: (locale === "ar" && name_ar) || name_en };
}