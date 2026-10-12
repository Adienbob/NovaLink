"use client";

import { useCartContext } from "../context/cart-context";

export function CartView() {
   const {
      items,
      isLoading,
      updateQuantity,
      removeItem,
      clearCart,
   } = useCartContext();

   if (isLoading) {
      return <p>Loading cart...</p>;
   }

   if (items.length === 0) {
      return <p>Your cart is empty.</p>;
   }

   const cartTotal = items.reduce(
      (total, item) => total + item.variant.price * item.quantity,
      0,
   );

   return (
      <section>
         <h1>Shopping Cart</h1>

         <ul>
            {items.map((item) => {
               const { variant } = item;
               const { product } = variant;
               const lineTotal = variant.price * item.quantity;

               const image = product.images[0];

               return (
                  <li key={item.id}>
                     {image && (
                        <img
                           src={image.url}
                           alt={image.alt_text ?? product.name}
                           width={120}
                           height={120}
                        />
                     )}

                     <h2>{product.name}</h2>

                     {product.brand && (
                        <p>Brand: {product.brand.name}</p>
                     )}

                     <p>Variant: {variant.variant_name}</p>
                     <p>SKU: {variant.sku}</p>
                     <p>Unit price: {variant.price.toFixed(2)} EGP</p>

                     <p>Quantity: {item.quantity}</p>

                     <button
                        type="button"
                        onClick={() =>
                           updateQuantity(
                              item.product_variant_id,
                              item.quantity - 1,
                           )
                        }
                        disabled={item.quantity <= 1}
                     >
                        -
                     </button>

                     <button
                        type="button"
                        onClick={() =>
                           updateQuantity(
                              item.product_variant_id,
                              item.quantity + 1,
                           )
                        }
                        disabled={
                           item.quantity >= variant.stock_quantity
                        }
                     >
                        +
                     </button>

                     <p>
                        Subtotal: {lineTotal.toFixed(2)} EGP
                     </p>

                     <button
                        type="button"
                        onClick={() =>
                           removeItem(item.product_variant_id)
                        }
                     >
                        Remove
                     </button>
                  </li>
               );
            })}
         </ul>

         <h2>Cart Total: {cartTotal.toFixed(2)} EGP</h2>

         <button type="button" onClick={clearCart}>
            Clear Cart
         </button>
      </section>
   );
}