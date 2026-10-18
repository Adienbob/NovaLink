import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware(async (auth, req) => {
   const pathname = req.nextUrl.pathname;

   const pathnameWithoutLocale = pathname.startsWith("/en")
      ? pathname.slice(3) || "/"
      : pathname;

   const isProtected =
      pathnameWithoutLocale === "/account" ||
      pathnameWithoutLocale.startsWith("/account/") ||
      pathnameWithoutLocale === "/admin" ||
      pathnameWithoutLocale.startsWith("/admin/") ||
      pathnameWithoutLocale === "/delivery" ||
      pathnameWithoutLocale.startsWith("/delivery/");

   if (isProtected) {
      await auth.protect();
   }

   return intlMiddleware(req);
});

export const config = {
   matcher: [
      "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
      "/(api|trpc)(.*)",
   ],
};