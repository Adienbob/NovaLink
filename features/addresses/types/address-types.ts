export interface Governorate {
   id: string;
   name: string;
}

export interface Address {
   id: string;
   user_id: string;
   label: string | null;
   recipient_name: string;
   phone: string;
   governorate_id: string;
   city: string;
   area: string;
   street: string;
   building: string | null;
   floor: string | null;
   apartment: string | null;
   landmark: string | null;
   notes: string | null;
   is_default: boolean;
   created_at: string;
   updated_at: string;
   governorate?: Governorate;
}