"use client";

import { useTranslations } from "next-intl";

const announcements = [
  "genuineProducts",
  "manufacturerWarranty",
  "delivery",
  "specialOffers",
  "securePayment",
  "support",
  "installation",
  "quickReplies",
] as const;

export function AnnouncementBar() {
  const t = useTranslations("AnnouncementBar");

  return (
    <div className="overflow-hidden border-b border-border bg-muted/70">
      <div className="announcement-marquee flex h-9 w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            style={{ minWidth: "100vw" }}
            className="flex shrink-0 items-center justify-around"
          >
            {announcements.map((item) => (
              <div
                key={item}
                className="flex shrink-0 items-center gap-3 px-6 text-xs font-medium text-secondary"
              >
                <span>{t(item)}</span>
                <span className="h-1 w-1 rounded-full bg-primary" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}