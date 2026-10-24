"use client";

import { useState } from "react";
import { useCartContext } from "@/features/cart/context/cart-context";
import { Button } from "@/components/ui/button";

type AddToCartButtonProps = {
  productVariantId: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productVariantId,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddToCart() {
    try {
      setIsAdding(true);
      setMessage("");

      await addItem(productVariantId, 1);

      setMessage("Added to cart successfully.");
    } catch {
      setMessage("Failed to add product to cart.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="space-y-2 w-full">
      <Button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding || disabled}
        isLoading={isAdding}
        className="w-full h-10 font-semibold text-sm"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </Button>

      {message && (
        <p
          role="status"
          className="text-xs text-center font-medium text-secondary"
        >
          {message}
        </p>
      )}
    </div>
  );
}