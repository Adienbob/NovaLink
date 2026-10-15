
export function categoryProductsQueryKey(slug: string) {
   return ["category-products", slug] as const;
}