import { Json } from "@/app/lib/supabase/database";


export function parseSpecs(
   value: Json | null
): Record<string, Json | undefined> | null {
   if (
      value === null ||
      typeof value !== "object" ||
      Array.isArray(value)
   ) {
      return null;
   }

   return value;
}