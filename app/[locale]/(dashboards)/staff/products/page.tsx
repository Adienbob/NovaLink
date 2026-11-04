import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabaseAdmin } from "@/app/lib/supabase/server";

export default async function ProductsPage() {
  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, name_en, slug, base_price, is_active")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your catalog items.</p>
        </div>
        <Button>
          <Link href="/staff/products/new">Add Product</Link>
        </Button>
      </div>

      <div className="border rounded-md bg-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">
                    <Link href={`/staff/products/${p.slug}`} className="hover:underline text-primary">
                      {p.name_en}
                    </Link>
                  </td>
                  <td className="p-3 text-muted-foreground font-mono text-xs">{p.slug}</td>
                  <td className="p-3">${Number(p.base_price).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      p.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                    }`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}