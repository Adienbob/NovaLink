"use client";

import { useState, useTransition } from "react";
import { deleteProduct, createProduct, updateProduct } from "../actions/products-actions";
import type { ProductFormValues } from "@/features/catalog/products/schema/product-schema";

export interface ProductItem {
  id: string;
  name: string;               
  name_en?: string;
  name_ar?: string | null;
  slug: string;
  description_en?: string;
  description_ar?: string | null;
  base_price: number;
  is_active: boolean;
  created_at: string;
  seo_title_en?: string | null;
  seo_title_ar?: string | null;
  seo_description_en?: string | null;
  seo_description_ar?: string | null;
  categories: { id: string; name: string } | null;
  brands: { id: string; name: string } | null;
  product_variants: {
    id: string;
    sku: string;
    variant_name: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
  }[];
  product_images: {
    id: string;
    url: string;
    alt_text: string | null;
    sort_order: number;
  }[];
}

type Brand = { id: string; name: string };
type Category = { id: string; name: string };

interface ProductsTableProps {
  products: ProductItem[];
  brands: Brand[];
  categories: Category[];
  userRole: "admin" | "owner" | "viewer" | "delivery";
  onRefresh: () => void;
}

export function ProductsTable({
  products,
  brands,
  categories,
  userRole,
  onRefresh,
}: ProductsTableProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // null = list, "create" = create form, ProductItem = edit form
  const [mode, setMode] = useState<"list" | "create" | ProductItem>("list");

  const canEdit = userRole === "admin" || userRole === "owner";

  const handleDelete = (productId: string) => {
    if (!canEdit) return;
    if (!confirm("Are you sure? This will delete all variants and images.")) return;

    setDeletingId(productId);
    setErrorMsg(null);

    startTransition(async () => {
      try {
        await deleteProduct(productId);
        onRefresh();
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to delete product.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const handleCreate = async (data: ProductFormValues) => {
    const payload = {
      ...data,
      specs_en: specsArrayToRecord(data.specs_en),
      specs_ar: specsArrayToRecord(data.specs_ar),
    };
    await createProduct(payload);
    setMode("list");
    onRefresh();
  };

  const handleUpdate = async (data: ProductFormValues) => {
    if (typeof mode === "string") return;
    await updateProduct(mode.id, data);   // you still need to implement updateProduct
    setMode("list");
    onRefresh();
  };

  
  if (mode !== "list") {
    const isEdit = mode !== "create";

    const initialData = isEdit
      ? {
          id: mode.id,
          name_en: mode.name_en ?? mode.name,
          name_ar: mode.name_ar ?? "",
          slug: mode.slug,
          description_en: mode.description_en ?? "",
          description_ar: mode.description_ar ?? "",
          brand_id: mode.brands?.id ?? null,
          category_id: mode.categories?.id ?? null,
          base_price: mode.base_price,
          seo_title_en: mode.seo_title_en ?? null,
          seo_title_ar: mode.seo_title_ar ?? null,
          seo_description_en: mode.seo_description_en ?? null,
          seo_description_ar: mode.seo_description_ar ?? null,
          is_active: mode.is_active,
        }
      : undefined;

    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h2 className="text-xl font-bold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEdit
              ? "Update the product details in both languages."
              : "Create a new product with Arabic and English content."}
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // List mode
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
         <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Manage inventory, multi-variant pricing, stock levels, and media galleries.
          </p>
        </div>
      </div>
        <div />
        {canEdit && (
          <button
            type="button"
            onClick={() => setMode("create")}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            + Add Product
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Base Price</th>
              <th className="px-4 py-3">Variants</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const mainImage = p.product_images?.[0]?.url;
                const totalStock = p.product_variants?.reduce(
                  (acc, v) => acc + v.stock_quantity,
                  0
                );

                return (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={p.name}
                          className="h-10 w-10 object-cover rounded border bg-background"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          NO IMG
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">
                        {p.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {p.categories?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {p.brands?.name || "-"}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      ${Number(p.base_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div>{p.product_variants?.length || 0} variant(s)</div>
                      <div className="text-muted-foreground">
                        Stock: {totalStock ?? 0}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.is_active ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canEdit ? (
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setMode(p)}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={isPending && deletingId === p.id}
                            className="text-xs font-medium text-destructive hover:underline disabled:opacity-50"
                          >
                            {deletingId === p.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          View only
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}