export const PRODUCT_ERROR_MESSAGES: Record<string, string> = {
  // Client/Action validation errors
  INVALID_PRODUCT_DATA: "Invalid product information. Please check all fields.",
  INVALID_VARIANT_DATA: "Invalid variant information provided.",
  INVALID_IMAGES_DATA: "Invalid image data provided.",

  // mapped DB errors
  PRODUCT_SLUG_EXISTS: "A product with this URL slug already exists.",
  SKU_ALREADY_EXISTS: "One of the provided SKUs is already in use.",
  PRODUCT_NOT_FOUND: "The requested product was not found.",
  VARIANT_NOT_FOUND: "The requested variant was not found.",

  // Generic fallbacks
  FAILED_TO_CREATE_PRODUCT: "Failed to create product. Please try again.",
  FAILED_TO_ADD_VARIANT: "Failed to add variant. Please try again.",
  FAILED_TO_ADD_IMAGES: "Failed to add images. Please try again.",
};

export function getErrorMessage(errorCode: string): string {
  return (
    PRODUCT_ERROR_MESSAGES[errorCode] ??
    "An unexpected error occurred. Please try again."
  );
}

export function mapProductDbError(
  error: { message?: string } | null,
  fallback: string
) {
  const msg = error?.message ?? "";
  // Unique constraint on products.slug
  if (msg.includes("products_slug_key")) return new Error("PRODUCT_SLUG_EXISTS");
  // Unique constraint on product_variants.sku
  if (msg.includes("product_variants_sku_key")) return new Error("SKU_ALREADY_EXISTS");
  // Custom RPC errors
  if (msg.includes("PRODUCT_NOT_FOUND")) return new Error("PRODUCT_NOT_FOUND");
  if (msg.includes("VARIANT_NOT_FOUND")) return new Error("VARIANT_NOT_FOUND");

  console.error(`DB Error (${fallback}):`, error);
  return new Error(fallback);
}