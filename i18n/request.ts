import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
   const currentLocale =
      locale && routing.locales.includes(locale as "ar" | "en")
         ? locale
         : routing.defaultLocale;

   return {
      locale: currentLocale,
      messages: (await import(`../messages/${currentLocale}.json`)).default,
   };
});