import { z } from "zod";

export const addressSchema = z.object({
   label: z.string().optional().nullable(),
   recipient_name: z.string().min(2, "Recipient name is required"),
   phone: z.string().min(8, "Valid phone number is required"),
   governorate_id: z.string().uuid("Please select a valid governorate"),
   city: z.string().min(1, "City is required"),
   area: z.string().min(1, "Area is required"),
   street: z.string().min(1, "Street is required"),
   building: z.string().optional().nullable(),
   floor: z.string().optional().nullable(),
   apartment: z.string().optional().nullable(),
   landmark: z.string().optional().nullable(),
   notes: z.string().optional().nullable(),
   is_default: z.boolean().default(false),
});

export type AddressFormData = z.infer<typeof addressSchema>;