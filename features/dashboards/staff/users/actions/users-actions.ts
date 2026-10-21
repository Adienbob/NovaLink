"use server";

import { requireRole } from "@/app/lib/auth/require-role";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export type StaffRole = "owner" | "admin" | "delivery" | "viewer";

export interface InviteStaffPayload {
   clerk_id: string;
   email: string;
   full_name: string;
   phone?: string | null;
   role: StaffRole;
}

export async function getStaffUsers() {
   // Fetch all users who have a assigned staff_role and are not soft-deleted by Clerk
   await requireRole(["admin", "owner", "viewer", "delivery"]);

   const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, clerk_id, email, phone, full_name, role, created_at, clerk_deleted_at")
      .not("role", "is", null)
      .is("clerk_deleted_at", null)
      .order("created_at", { ascending: false });

   if (error) {
      console.error("Error fetching staff users:", error);
      throw new Error("FAILED_TO_FETCH_STAFF_USERS");
   }

   return data || [];
}

export async function updateUserRole(targetUserId: string, newRole: StaffRole) {
   const staffUser = await requireRole(["admin", "owner"]);

   if (newRole === "owner" && staffUser.role !== "owner") {
      throw new Error("ONLY_OWNER_CAN_ASSIGN_OWNER_ROLE");
   }

   const { data: targetUser, error: fetchErr } = await supabaseAdmin
      .from("users")
      .select("role, email, clerk_id")
      .eq("id", targetUserId)
      .single();

   if (fetchErr || !targetUser) {
      throw new Error("USER_NOT_FOUND");
   }

   if (targetUser.role === "owner" && staffUser.role !== "owner") {
      throw new Error("CANNOT_MODIFY_OWNER_ACCOUNT");
   }

   // Update role enum in public.users
   const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role: newRole })
      .eq("id", targetUserId)
      .select()
      .single();

   if (error) {
      console.error("Error updating user role:", error);
      throw new Error("FAILED_TO_UPDATE_ROLE");
   }

   // Centralized Audit Log
   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "UPDATE_USER_ROLE",
      entity_type: "user",
      entity_id: targetUserId,
      metadata: {
         previous_role: targetUser.role,
         new_role: newRole,
         target_email: targetUser.email,
         clerk_id: targetUser.clerk_id,
      },
   });

   return data;
}

export async function softDeleteUser(targetUserId: string) {
   const staffUser = await requireRole(["admin", "owner"]);

   const { data: targetUser } = await supabaseAdmin
      .from("users")
      .select("role, email, clerk_id")
      .eq("id", targetUserId)
      .single();

   if (targetUser?.role === "owner" && staffUser.role !== "owner") {
      throw new Error("CANNOT_DEACTIVATE_OWNER_ACCOUNT");
   }

   const now = new Date().toISOString();

   const { data, error } = await supabaseAdmin
      .from("users")
      .update({ clerk_deleted_at: now })
      .eq("id", targetUserId)
      .select()
      .single();

   if (error) {
      console.error("Error soft-deleting staff user:", error);
      throw new Error("FAILED_TO_DELETE_STAFF_USER");
   }

   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "SOFT_DELETE_STAFF_USER",
      entity_type: "user",
      entity_id: targetUserId,
      metadata: {
         target_email: targetUser?.email,
         clerk_id: targetUser?.clerk_id,
         deleted_at: now,
      },
   });

   return data;
}

export async function createStaffUserRecord(payload: InviteStaffPayload) {
   const staffUser = await requireRole(["admin", "owner"]);

   if (payload.role === "owner" && staffUser.role !== "owner") {
      throw new Error("ONLY_OWNER_CAN_ASSIGN_OWNER_ROLE");
   }

   const { data: userRecord, error: dbError } = await supabaseAdmin
      .from("users")
      .insert({
         clerk_id: payload.clerk_id.trim(),
         email: payload.email.toLowerCase().trim(),
         full_name: payload.full_name.trim(),
         phone: payload.phone || null,
         role: payload.role,
      })
      .select()
      .single();

   if (dbError) {
      console.error("Error creating user record in DB:", dbError);
      throw new Error("FAILED_TO_SAVE_USER_RECORD");
   }

   await supabaseAdmin.from("activity_logs").insert({
      user_id: staffUser.id,
      action: "CREATE_STAFF_USER",
      entity_type: "user",
      entity_id: userRecord.id,
      metadata: { email: payload.email, role: payload.role, clerk_id: payload.clerk_id },
   });

   return userRecord;
}