import { parseSpecs } from './parse-specs';
import { parseKeyFeatures } from './parse-key-features';
import { Json } from '@/app/lib/supabase/database';

type Locale = "ar" | "en";

type Localizable = {
   name_en: string;
   name_ar: string | null;
   description_en: string;
   description_ar: string | null;
   seo_title_en?: string | null;
   seo_title_ar?: string | null;
   seo_description_en?: string | null;
   seo_description_ar?: string | null;
   key_features_en?: Json | null;
   key_features_ar?: Json | null;
   specs_en?: Json;
   specs_ar?: Json | null;
};

const isNonEmptyObject = (v: Json | null): v is Record<string, Json | undefined> =>
   !!v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length > 0;

const isNonEmptyArray = (v: Json | null): v is Json[] =>
   Array.isArray(v) && v.length > 0;

export function localizeProduct<T extends Localizable>(row: T, locale: Locale) {

   const {
      name_en, name_ar,
      description_en, description_ar,
      seo_title_en, seo_title_ar,
      seo_description_en, seo_description_ar,
      key_features_en, key_features_ar,
      specs_en, specs_ar,
      ...rest
   } = row;
   
   const isAr = locale === 'ar';
   const selectedKeyFeatures =
   isAr
      ? key_features_ar ?? key_features_en ?? null
      : key_features_en ?? key_features_ar ?? null;

   const selectedSpecs =
   isAr
      ? specs_ar ?? specs_en ?? null
      : specs_en ?? specs_ar ?? null;
      
   const selectedSeotitle =
   isAr
      ? seo_title_ar ?? seo_title_en ?? null
      : seo_title_en ?? seo_title_ar ?? null;
      
   const selectedSeoDescription =
   isAr
      ? seo_description_ar ?? seo_description_en ?? null
      : seo_description_en ?? seo_description_ar ?? null;
      
   return {
      ...rest,
      name: (isAr && name_ar) || name_en,
      description: (isAr && description_ar) || description_en,
      seo_title: selectedSeotitle,
      seo_description: selectedSeoDescription,
      key_features: selectedKeyFeatures
         ? parseKeyFeatures(selectedKeyFeatures)
         : null,
      specs: selectedSpecs
         ? parseSpecs(selectedSpecs)
         : null,
   };
}