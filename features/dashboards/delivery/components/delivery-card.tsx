import * as React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeliveryItem } from "../types/delivery";

interface DeliveryCardProps {
  delivery: DeliveryItem;
  locale: string;
  onUpdateStatus?: (deliveryId: string, newStatus: string) => void;
  isLoading?: boolean;
}

export function DeliveryCard({
  delivery,
  locale,
  onUpdateStatus,
  isLoading = false,
}: DeliveryCardProps) {
  const t = useTranslations("DeliveryCard");
  const isAr = locale === "ar";

  const order = delivery.orders;
  const user = order?.users;

  const addressText = React.useMemo(() => {
    const snap = order?.delivery_address_snapshot;

    if (!snap) return t("notAvailable");
    if (typeof snap === "string") return snap;

    const parts = [snap.city, snap.street, snap.details, snap.address_line].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : JSON.stringify(snap);
  }, [order?.delivery_address_snapshot, t]);

  const statusBadgeVariant = {
    assigned: "warning" as const,
    picked_up: "default" as const,
    delivered: "success" as const,
    failed: "destructive" as const,
  }[delivery.status] || "outline";

  return (
    <Card className="w-full border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-[var(--border)]/50">
        <div className="flex flex-col">
          <CardTitle className="text-sm font-bold">
            {t("order")} #
            {order?.id ? order.id.slice(0, 8) : delivery.order_id.slice(0, 8)}
          </CardTitle>

          {order?.payment_method && (
            <span className="text-[10px] text-[var(--secondary)] uppercase font-semibold mt-0.5">
              {order.payment_method}
            </span>
          )}
        </div>

        <Badge variant={statusBadgeVariant} className="capitalize text-[11px]">
          {t(`status.${delivery.status}`)}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 space-y-3 text-xs">
        {/* Customer */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[var(--secondary)] text-[11px] font-medium">
            {t("customer")}
          </span>

          <span className="font-semibold text-[var(--foreground)] text-sm">
            {user?.full_name || t("unnamedCustomer")}
          </span>
        </div>

        {/* Contact Phone */}
        {user?.phone && (
          <div className="flex flex-col gap-0.5">
            <span className="text-[var(--secondary)] text-[11px] font-medium">
              {t("contactPhone")}
            </span>

            <a
              href={`tel:${user.phone}`}
              className="text-[var(--primary)] hover:underline font-mono font-bold text-sm text-start dir-ltr w-fit"
            >
              {user.phone}
            </a>
          </div>
        )}

        {/* Delivery Address */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[var(--secondary)] text-[11px] font-medium">
            {t("deliveryAddress")}
          </span>

          <p className="text-[var(--foreground)] leading-relaxed">
            {addressText}
          </p>
        </div>

        {/* Total Amount */}
        {order?.total !== undefined && (
          <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-xs">
            <span className="text-[var(--secondary)]">
              {t("totalAmount")}
            </span>

            <span className="font-bold text-sm text-[var(--foreground)] font-mono">
              {order.total} {t("sar")}
            </span>
          </div>
        )}
      </CardContent>

      {/* Actions */}
      {onUpdateStatus && delivery.status !== "delivered" && delivery.status !== "failed" && (
        <CardFooter className="p-4 pt-0 gap-2">
          {delivery.status === "assigned" && (
            <Button
              size="sm"
              className="w-full h-10 text-xs font-semibold"
              onClick={() => onUpdateStatus(delivery.id, "picked_up")}
              isLoading={isLoading}
            >
              {t("markAsPickedUp")}
            </Button>
          )}

          {delivery.status === "picked_up" && (
            <Button
              size="sm"
              className="w-full h-10 text-xs font-semibold bg-[var(--success)] hover:opacity-90 text-white"
              onClick={() => onUpdateStatus(delivery.id, "delivered")}
              isLoading={isLoading}
            >
              {t("completeDelivery")}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}