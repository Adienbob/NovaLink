"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export interface ActivityLogFilters {
   entityType?: string;
   action?: string;
   userId?: string;
   page?: number;
   limit?: number;
}

export async function getActivityLogs(filters: ActivityLogFilters = {}) {
   // Only Admins and Owners can inspect system activity logs
   await requireRole(["admin", "owner"]);

   const page = filters.page || 1;
   const limit = filters.limit || 50;
   const offset = (page - 1) * limit;

   let query = supabaseAdmin
      .from("activity_logs")
      .select(
         `
         id,
         user_id,
         action,
         entity_type,
         entity_id,
         metadata,
         created_at,
         user:users!activity_logs_user_id_fkey (
            id,
            full_name,
            email,
            role
         )
      `,
         { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

   if (filters.entityType && filters.entityType !== "all") {
      query = query.eq("entity_type", filters.entityType);
   }

   if (filters.action && filters.action.trim() !== "") {
      query = query.ilike("action", `%${filters.action.trim()}%`);
   }

   if (filters.userId && filters.userId !== "all") {
      query = query.eq("user_id", filters.userId);
   }

   const { data, count, error } = await query;

   if (error) {
      console.error("Error fetching activity logs:", error);
      throw new Error("FAILED_TO_FETCH_ACTIVITY_LOGS");
   }

   return {
      logs: data || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
   };
}