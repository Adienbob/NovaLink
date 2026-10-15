
export function brandProductsQueryKey(slug: string) {
   return ["brand-products", slug] as const;
}