import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export async function requireUser(options?: { retries?: number; delayMs?: number }) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  const retries = options?.retries ?? 3;
  const delayMs = options?.delayMs ?? 150;

  let lastError: any = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, clerk_id, role")
      .eq("clerk_id", userId)
      .single();

    if (user && !error) {
      return user;
    }

    lastError = error;

    // Only retry on "not found". Real DB errors should fail immediately.
    if (error && error.code !== "PGRST116") {
      break;
    }

    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, delayMs * (attempt + 1))); // mild backoff
    }
  }

  throw new Error("USER_NOT_FOUND");
}