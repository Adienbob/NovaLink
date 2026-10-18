import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database"; // ← تأكد من اسم الملف الأصلي

export type Database = MergeDeep<
   DatabaseGenerated,
   {
      public: {
         Functions: {
         create_order_transaction: {
            Args: {
               p_user_id: string;
               p_idempotency_key: string | null;
               p_governorate_id: string;
               p_city: string;
               p_area: string;
               p_street: string;
               p_building: string | null;
               p_floor: string | null;
               p_apartment: string | null;
               p_landmark: string | null;
               p_recipient_name: string;
               p_phone: string;
               p_notes: string | null;
               p_items: {
               variant_id: string;
               quantity: number;
               expected_price: number;
               }[];
            };
            Returns: {
               success: boolean;
               order_id?: string;
               is_retry?: boolean;
               code?: string;
               message?: string;
               variant_id?: string;
               new_price?: number;
            };
         };
         };
      };
   }
>;