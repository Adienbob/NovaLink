import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.trychannel3.com",
        pathname: "/cleaned/**",
      },
      {
        protocol: "https",
        hostname: "cdn.trychannel3.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
