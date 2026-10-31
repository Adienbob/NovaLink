import { Json } from "@/app/lib/supabase/database";


export function parseKeyFeatures(value: Json | null): string[] | null {
   if (!Array.isArray(value)) return null;

   if (!value.every((item): item is string => typeof item === "string")) {
      return null;
   }

   return value;
}