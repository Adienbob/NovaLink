"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { createBrand, deleteBrand, type BrandPayload } from "../actions/brands-actions";
import { Button } from "@/components/ui/button";

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

interface BrandsListProps {
  brands: BrandItem[];
  userRole: "admin" | "owner" | "viewer" | "delivery";
  onRefresh: () => void;
}

export function BrandsList({ brands, userRole, onRefresh }: BrandsListProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canEdit = userRole === "admin" || userRole === "owner";

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit || !name.trim()) return;

    setErrorMsg(null);
    startTransition(async () => {
      try {
        const payload: BrandPayload = {
          name: name.trim(),
          logo_url: logoUrl.trim() || null,
        };
        await createBrand(payload);
        setName("");
        setLogoUrl("");
        onRefresh();
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to create brand.");
      }
    });
  };

  const handleDelete = (brandId: string) => {
    if (!canEdit) return;
    if (!confirm("Are you sure you want to delete this brand?")) return;

    setDeletingId(brandId);
    setErrorMsg(null);

    startTransition(async () => {
      try {
        await deleteBrand(brandId);
        onRefresh();
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to delete brand.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      {/* Creation Form (Admins & Owners only) */}
      {canEdit && (
        <div className="rounded-lg border border-border bg-surface p-5 shadow-sm h-fit space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border pb-3">
            Add New Brand
          </h2>

          {errorMsg && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Brand Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="e.g. Nike, Apple"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Logo URL <span className="text-xs text-secondary font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full h-10 font-semibold text-sm mt-2"
            >
              {isPending ? "Saving..." : "Create Brand"}
            </Button>
          </form>
        </div>
      )}

      {/* Brands Data Table */}
      <div className={canEdit ? "md:col-span-2" : "md:col-span-3"}>
        <div className="rounded-lg border border-border bg-surface shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-secondary">
                <tr>
                  <th className="px-4 py-3.5">Logo</th>
                  <th className="px-4 py-3.5">Brand Name</th>
                  <th className="px-4 py-3.5">Slug</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {brands.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-12 text-center text-secondary text-sm"
                    >
                      No brands found.
                    </td>
                  </tr>
                ) : (
                  brands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="transition-colors hover:bg-muted/30 text-foreground"
                    >
                      <td className="px-4 py-3">
                        {brand.logo_url ? (
                          <div className="relative h-9 w-9 overflow-hidden rounded-md border border-border bg-background p-1">
                            <img
                              src={brand.logo_url}
                              alt={brand.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-9 w-9 rounded-md border border-border bg-muted flex items-center justify-center text-xs font-bold text-secondary uppercase">
                            {brand.name.slice(0, 2)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {brand.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-secondary">
                        {brand.slug}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canEdit ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(brand.id)}
                            disabled={isPending && deletingId === brand.id}
                            className="h-8 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {deletingId === brand.id ? "Deleting..." : "Delete"}
                          </Button>
                        ) : (
                          <span className="text-xs text-secondary italic">
                            View only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}