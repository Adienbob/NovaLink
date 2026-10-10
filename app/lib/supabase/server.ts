import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/app/lib/supabase/database.ts";

export const supabaseAdmin = createClient<Database>(
   process.env.SUPABASE_URL!,
   process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export { createClient };
