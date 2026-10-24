import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, OrderStatus } from "@/components/shared/order-status-badge";

export type DeliveryStatus = "assigned" | "picked_up" | "delivered" | "failed";

export interface DeliveryTask {
   id: string;
   orderId: string;
   orderNumber: string;
   customerName: string;
   phone: string;
   address: string;
   totalAmount: string;
   orderStatus: OrderStatus;
   deliveryStatus: DeliveryStatus;
}

interface DeliveryTaskCardProps {
   task: DeliveryTask;
   onUpdateStatus?: (deliveryId: string, newStatus: DeliveryStatus) => void;
   isLoading?: boolean;
   labels?: {
      orderLabel?: string;
      customerLabel?: string;
      phoneLabel?: string;
      addressLabel?: string;
      pickupBtn?: string;
      completeBtn?: string;
   };
}

export function DeliveryTaskCard({
   task,
   onUpdateStatus,
   isLoading = false,
   labels = {},
}: DeliveryTaskCardProps) {
   const isAssigned = task.deliveryStatus === "assigned";
   const isPickedUp = task.deliveryStatus === "picked_up";
   const isCompleted = task.deliveryStatus === "delivered" || task.deliveryStatus === "failed";

   return (
      <Card className="w-full shadow-sm border-[var(--border)] transition-all hover:shadow-md">
         <CardHeader className="pb-3">
         <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-bold text-[var(--foreground)]">
               {labels.orderLabel || "Order"} #{task.orderNumber}
            </CardTitle>
            <OrderStatusBadge status={task.orderStatus} />
         </div>
         </CardHeader>

         <CardContent className="space-y-2 text-sm">
         <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--secondary)]">
               {labels.customerLabel || "Customer"}
            </span>
            <span className="font-medium text-[var(--foreground)]">{task.customerName}</span>
         </div>

         <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--secondary)]">
               {labels.phoneLabel || "Phone"}
            </span>
            <a
               href={`tel:${task.phone}`}
               className="text-[var(--primary)] underline underline-offset-2 font-medium w-fit"
            >
               {task.phone}
            </a>
         </div>

         <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--secondary)]">
               {labels.addressLabel || "Delivery Address"}
            </span>
            <p className="text-[var(--foreground)] leading-snug">{task.address}</p>
         </div>

         <div className="pt-2 border-t border-[var(--border)] flex justify-between items-center text-xs">
            <span className="text-[var(--secondary)]">Total Amount</span>
            <span className="font-bold text-base text-[var(--foreground)]">{task.totalAmount}</span>
         </div>
         </CardContent>

         {!isCompleted && onUpdateStatus && (
         <CardFooter className="pt-0 gap-2">
            {isAssigned && (
               <Button
               className="w-full h-11 text-sm font-semibold"
               onClick={() => onUpdateStatus(task.id, "picked_up")}
               isLoading={isLoading}
               >
               {labels.pickupBtn || "Mark as Picked Up"}
               </Button>
            )}

            {isPickedUp && (
               <Button
               className="w-full h-11 text-sm font-semibold"
               variant="default"
               onClick={() => onUpdateStatus(task.id, "delivered")}
               isLoading={isLoading}
               >
               {labels.completeBtn || "Complete Delivery"}
               </Button>
            )}
         </CardFooter>
         )}
      </Card>
   );
}