"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartContext } from "../context/cart-context";
import { Button } from "@/components/ui/button";

export function CartView() {
  const {
    items,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartContext();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <p className="text-sm font-medium text-secondary animate-pulse">
          Loading cart...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center p-8">
        <div className="rounded-full bg-muted p-6 text-3xl">🛒</div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
          <p className="text-sm text-secondary">
            Looks like you haven't added anything to your cart yet.
          </p>
        </div>
        <Button asChild className="mt-2">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const cartTotal = items.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0,
  );

  return (
    <section className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-xs text-secondary mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="text-destructive hover:bg-destructive/10 text-xs"
        >
          Clear Cart
        </Button>
      </div>

      {/* Cart Grid / Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface overflow-hidden">
            {items.map((item) => {
              const { variant } = item;
              const { product } = variant;
              const lineTotal = variant.price * item.quantity;
              const image = product.images?.[0];

              return (
                <li
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 text-foreground transition-colors hover:bg-muted/30"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-24 h-24 flex-shrink-0 overflow-hidden rounded-md bg-muted border border-border">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.alt_text ?? product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-secondary">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1 w-full">
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                        {product.name}
                      </h2>
                    </div>

                    {product.brand && (
                      <p className="text-xs text-secondary">
                        Brand: <span className="font-medium">{product.brand.name}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-secondary font-mono">
                      {variant.variant_name && <span>Variant: {variant.variant_name}</span>}
                      <span>SKU: {variant.sku}</span>
                    </div>

                    <p className="text-xs font-semibold font-mono text-foreground pt-1">
                      Unit price: {variant.price.toFixed(2)} EGP
                    </p>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex sm:flex-col justify-between items-end sm:items-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 border border-border rounded-md bg-background p-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-xs"
                        onClick={() =>
                          updateQuantity(item.product_variant_id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="text-xs font-mono font-bold px-2 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-xs"
                        onClick={() =>
                          updateQuantity(item.product_variant_id, item.quantity + 1)
                        }
                        disabled={item.quantity >= variant.stock_quantity}
                      >
                        +
                      </Button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold font-mono text-foreground">
                        {lineTotal.toFixed(2)} EGP
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product_variant_id)}
                        className="text-xs text-destructive hover:underline font-medium block ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Order Summary Sidebar */}
        <div className="rounded-lg border border-border bg-surface p-6 space-y-6 sticky top-24">
          <h2 className="text-lg font-bold border-b border-border pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-secondary">
              <span>Subtotal</span>
              <span className="font-mono font-medium">{cartTotal.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Shipping</span>
              <span className="text-xs">Calculated at checkout</span>
            </div>

            <div className="border-t border-border pt-3 flex justify-between font-bold text-base text-foreground">
              <span>Total</span>
              <span className="font-mono text-lg">{cartTotal.toFixed(2)} EGP</span>
            </div>
          </div>

          <Button asChild className="w-full h-11 font-semibold">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}