import { z } from "zod";

// 1. Single Cart Item Schema
export const checkoutItemSchema = z.object({
   variantId: z
      .string({ message: "Variant ID is required" })
      .uuid("Invalid Variant ID format"),
   quantity: z
      .number({ message: "Quantity is required" })
      .int("Quantity must be an integer")
      .positive("Quantity must be greater than 0"),
   expectedPrice: z
      .number({ message: "Expected price is required" })
      .positive("Price must be greater than 0"),
});

// 2. Delivery Address Schema (Reusable for Address Forms)
export const deliveryAddressSchema = z.object({
   recipientName: z
      .string()
      .min(3, "Recipient name must be at least 3 characters")
      .max(100, "Recipient name is too long"),
   phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^(010|011|012|015)[0-9]{8}$/, "Please enter a valid Egyptian phone number"),
   governorateId: z
      .string({ message: "Please select a governorate" })
      .uuid("Invalid governorate ID"),
   city: z
      .string()
      .min(2, "City is required")
      .max(100, "City name is too long"),
   area: z
      .string()
      .min(2, "Area is required")
      .max(100, "Area name is too long"),
   street: z
      .string()
      .min(2, "Street address is required")
      .max(200, "Street address is too long"),
   building: z.string().max(50).optional().nullable(),
   floor: z.string().max(20).optional().nullable(),
   apartment: z.string().max(20).optional().nullable(),
   landmark: z.string().max(200).optional().nullable(),
});

// 3. Complete Checkout Form Schema
export const checkoutInputSchema = deliveryAddressSchema.extend({
   idempotencyKey: z
      .string({ message: "Idempotency key is missing" })
      .uuid("Invalid Idempotency Key format"),
   notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().nullable(),
   items: z
      .array(checkoutItemSchema)
      .min(1, "Your cart cannot be empty"),
});

export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;
export type DeliveryAddressInput = z.infer<typeof deliveryAddressSchema>;
export type CheckoutInput = z.infer<typeof checkoutInputSchema>;