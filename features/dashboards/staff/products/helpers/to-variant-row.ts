import type { VariantValues } from "../schema/variant-schema";

// changes from object to array as (attributes) in the database
export function toVariantRow(v: VariantValues) {
   return {
      sku: v.sku,
      variant_name: v.variant_name,
      attributes: Object.fromEntries(
         v.attributes.filter((a) => a.key).map((a) => [a.key, a.value])
      ),
      base_price_usd: v.base_price_usd,
      price: v.price,
      stock_quantity: v.stock_quantity,
   };
}