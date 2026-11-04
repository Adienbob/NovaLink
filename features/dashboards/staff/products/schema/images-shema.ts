import { z } from "zod";

export const imageSchema = z.object({
   url: z.string().trim().url("Invalid image URL"),
   alt_text: z.string().trim().nullable(),
});

export type ImageValues = z.infer<typeof imageSchema>;