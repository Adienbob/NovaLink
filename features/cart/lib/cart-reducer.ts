import type { CartDisplayItem } from "../types/cart-item";

export type CartState = {
   items: CartDisplayItem[];
};

export type CartAction =
   | { type: "SET_CART"; payload: CartDisplayItem[] }
   | { type: "ADD_ITEM"; payload: CartDisplayItem }
   | {
         type: "UPDATE_QUANTITY";
         payload: { variantId: string; quantity: number };
      }
   | { type: "REMOVE_ITEM"; payload: { variantId: string } }
   | { type: "CLEAR_CART" };

export const initialCartState: CartState = {
   items: [],
};

export function cartReducer(
   state: CartState,
   action: CartAction,
): CartState {
   switch (action.type) {
      case "SET_CART":
         return {
            items: action.payload,
         };

      case "ADD_ITEM": {
         const existingItem = state.items.find(
            (item) =>
               item.product_variant_id ===
               action.payload.product_variant_id,
         );

         if (existingItem) {
            return {
               items: state.items.map((item) =>
                  item.product_variant_id ===
                  action.payload.product_variant_id
                     ? {
                           ...item,
                           quantity:
                              item.quantity + action.payload.quantity,
                        }
                     : item,
               ),
            };
         }

         return {
            items: [...state.items, action.payload],
         };
      }

      case "UPDATE_QUANTITY":
         return {
            items: state.items.map((item) =>
               item.product_variant_id === action.payload.variantId
                  ? {
                        ...item,
                        quantity: action.payload.quantity,
                     }
                  : item,
            ),
         };

      case "REMOVE_ITEM":
         return {
            items: state.items.filter(
               (item) =>
                  item.product_variant_id !== action.payload.variantId,
            ),
         };

      case "CLEAR_CART":
         return initialCartState;

      default:
         return state;
   }
}
