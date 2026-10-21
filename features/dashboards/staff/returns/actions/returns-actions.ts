"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export type ReturnStatus = "pending" | "approved" | "rejected" | "refunded";

export interface GetReturnsParams {
   page?: number;
   limit?: number;
   status?: ReturnStatus | "all";
}

export async function getStaffReturns({
   page = 1,
   limit = 10,
   status = "all",
}: GetReturnsParams = {}) {
   // 1. Role Check - Viewers, Admins, and Owners can view return requests
   await requireRole(["admin", "owner", "viewer"]);

   const offset = (page - 1) * limit;

   let query = supabaseAdmin
      .from("returns")
      .select(
         `
         id,
         order_id,
         reason,
         status,
         refund_amount,
         created_at,
         updated_at,
         orders (
            id,
            total,
            status,
            users (
               full_name,
               email,
               phone
            )
         )
      `,
         { count: "exact" }
      );

   if (status && status !== "all") {
      query = query.eq("status", status);
   }

   query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

   const { data, count, error } = await query;

   if (error) {
      console.error("Error fetching staff returns:", error);
      throw new Error("FAILED_TO_FETCH_RETURNS");
   }

   return {
      returns: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
   };
}

export async function updateReturnStatus(
   returnId: string,
   newStatus: ReturnStatus
) {
   // 1. Role Check - ONLY Admin & Owner can approve/reject/refund returns
   const staffUser = await requireRole(["admin", "owner"]);

   // 2. Fetch current return record to ensure it exists
   const { data: currentReturn, error: fetchError } = await supabaseAdmin
      .from("returns")
      .select("id, status, order_id")
      .eq("id", returnId)
      .single();

   if (fetchError || !currentReturn) {
      throw new Error("RETURN_REQUEST_NOT_FOUND");
   }

   const previousStatus = currentReturn.status as ReturnStatus;

   // Prevent modifications to already finalized return requests
   if (previousStatus === "refunded" || previousStatus === "rejected") {
      throw new Error("CANNOT_MODIFY_FINALIZED_RETURN");
   }

   // 3. Perform database update
   const { data: updatedReturn, error: updateError } = await supabaseAdmin
      .from("returns")
      .update({
         status: newStatus,
         updated_at: new Date().toISOString(),
      })
      .eq("id", returnId)
      .select()
      .single();

   if (updateError) {
      console.error("Error updating return status:", updateError);
      throw new Error("FAILED_TO_UPDATE_RETURN");
   }

   // 4. Record audit log entry
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "UPDATE_RETURN_STATUS",
      entity_type: "return",
      entity_id: returnId,
      metadata: {
         previous_status: previousStatus,
         new_status: newStatus,
         order_id: currentReturn.order_id,
      },
   });

   return updatedReturn;
}