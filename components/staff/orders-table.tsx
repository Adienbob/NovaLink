import * as React from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, OrderStatus } from "@/components/shared/order-status-badge";

export interface StaffOrderRow {
   id: string;
   orderNumber: string;
   customerName: string;
   totalAmount: string;
   status: OrderStatus;
   createdAt: string;
   itemsCount: number;
}

interface OrdersTableProps {
   orders: StaffOrderRow[];
   onViewDetails?: (orderId: string) => void;
   onAssignDriver?: (orderId: string) => void;
   labels?: {
      orderNo?: string;
      customer?: string;
      items?: string;
      total?: string;
      status?: string;
      date?: string;
      actions?: string;
      viewBtn?: string;
      assignBtn?: string;
      emptyState?: string;
   };
}

export function OrdersTable({
   orders,
   onViewDetails,
   onAssignDriver,
   labels = {},
}: OrdersTableProps) {
   if (!orders || orders.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)]">
         <p className="text-sm text-[var(--secondary)]">
            {labels.emptyState || "No orders found."}
         </p>
         </div>
      );
   }

   return (
      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)]">
         <Table>
         <TableHeader>
            <TableRow>
               <TableHead>{labels.orderNo || "Order #"}</TableHead>
               <TableHead>{labels.customer || "Customer"}</TableHead>
               <TableHead>{labels.items || "Items"}</TableHead>
               <TableHead>{labels.total || "Total"}</TableHead>
               <TableHead>{labels.status || "Status"}</TableHead>
               <TableHead>{labels.date || "Date"}</TableHead>
               <TableHead className="text-end">{labels.actions || "Actions"}</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {orders.map((order) => {
               const canAssign = order.status === "confirmed";

               return (
               <TableRow key={order.id}>
                  <TableCell className="font-semibold text-[var(--foreground)]">
                     #{order.orderNumber}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.itemsCount}</TableCell>
                  <TableCell className="font-medium">{order.totalAmount}</TableCell>
                  <TableCell>
                     <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-xs text-[var(--secondary)]">
                     {order.createdAt}
                  </TableCell>
                  <TableCell className="text-end">
                     <div className="flex items-center justify-end gap-2">
                     {canAssign && onAssignDriver && (
                        <Button
                           size="sm"
                           variant="outline"
                           onClick={() => onAssignDriver(order.id)}
                        >
                           {labels.assignBtn || "Assign Driver"}
                        </Button>
                     )}
                     {onViewDetails && (
                        <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => onViewDetails(order.id)}
                        >
                           {labels.viewBtn || "View"}
                        </Button>
                     )}
                     </div>
                  </TableCell>
               </TableRow>
               );
            })}
         </TableBody>
         </Table>
      </div>
   );
}