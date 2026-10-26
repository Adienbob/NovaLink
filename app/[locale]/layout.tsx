
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { ClerkProvider } from "@clerk/nextjs";
import { arSA } from "@clerk/localizations";
import { CartProvider } from "@/features/cart/components/cart-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import QueryProvider from "@/shared/providers/query-provider";
import "@/app/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StoreNavigation } from "@/components/navigation/store-navigation";

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

  const messages = await getMessages();



  const font = locale === "ar" ? arabicFont : englishFont;
  const clerkLocalization = locale === "ar" ? arSA : undefined;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        <ClerkProvider localization={clerkLocalization}>
          <body className={font.className}>
            <main className="bg-background w-full">
              <QueryProvider>
                <CartProvider>
                    <NextIntlClientProvider messages={messages}>
                      <Header />
                        {children}
                      <Footer />
                    </NextIntlClientProvider>
                </CartProvider>
              </QueryProvider>
            </main>
          </body>
        </ClerkProvider>
    </html>
  );
}