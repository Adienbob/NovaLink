// database.ts
import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database";

export type Database = MergeDeep<
   DatabaseGenerated,
   {
      public: {
         Functions: {
            create_order_transaction: {
               Args: {
                  p_building: string | null;
                  p_floor: string | null;
                  p_apartment: string | null;
                  p_landmark: string | null;
                  p_notes: string | null;
               };
            };
         };
      };
   }
>;