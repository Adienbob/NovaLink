import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
   const requested = await requestLocale;

   const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

   const messages = {
      ...(await import(`../messages/${locale}/common.json`)).default,
      ...(await import(`../messages/${locale}/home.json`)).default,
      ...(await import(`../messages/${locale}/catalog.json`)).default,
      ...(await import(`../messages/${locale}/cart.json`)).default,
      ...(await import(`../messages/${locale}/checkout.json`)).default,
      ...(await import(`../messages/${locale}/account.json`)).default,
      ...(await import(`../messages/${locale}/staff.json`)).default,
      ...(await import(`../messages/${locale}/delivery.json`)).default,
   };

   return {
      locale,
      messages,
   };
});