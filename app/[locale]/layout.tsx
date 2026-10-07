import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { ClerkProvider } from "@clerk/nextjs";
import { arSA } from "@clerk/localizations";

const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const englishFont = Inter({
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const font = locale === "ar" ? arabicFont : englishFont;
  const clerkLocalization = locale === "ar" ? arSA : undefined;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <ClerkProvider localization={clerkLocalization}>
        <body className={font.className}>{children}</body>
      </ClerkProvider>
    </html>
  );
}