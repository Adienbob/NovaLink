create type staff_role as enum (
  'viewer',
  'delivery',
  'admin',
  'owner'
);

create table users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  email text unique not null,
  phone text,
  full_name text,
  role staff_role,
  created_at timestamptz not null default now()
);

create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  parent_id uuid references categories(id) on delete set null
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null,

  brand_id uuid references brands(id),
  category_id uuid references categories(id),

  base_price numeric(10,2) not null,

  seo_title text,
  seo_description text,

  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category
  on products(category_id);

create index idx_products_brand
  on products(brand_id);

create table product_variants (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references products(id) on delete cascade,

  sku text unique not null,
  variant_name text not null,

  attributes jsonb not null default '{}',

  base_price_usd numeric(10,2),
  price numeric(10,2) not null,

  stock_quantity integer not null default 0
    check (stock_quantity >= 0),

  is_active boolean not null default true
);

create index idx_variants_product
  on product_variants(product_id);

create table product_images (
  id uuid primary key default gen_random_uuid(),

  product_id uuid not null
    references products(id) on delete cascade,

  variant_id uuid
    references product_variants(id) on delete cascade,

  url text not null,
  alt_text text,
  sort_order integer not null default 0
);

create table branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into branches (name, address, phone)
values (
  'Main Branch',
  'Cairo, Egypt',
  null
);

create type order_status as enum (
  'pending_confirmation',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'return_requested'
);

create type payment_method as enum (
  'cod',
  'paymob',
  'fawry'
);

create type payment_status as enum (
  'pending',
  'paid',
  'failed',
  'refunded'
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  product_variant_id uuid not null
    references public.product_variants(id)
    on delete cascade,

  quantity integer not null
    check (quantity > 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, product_variant_id)
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid
    references public.users(id)
    on delete set null,

  action text not null,

  entity_type text not null,

  entity_id uuid,

  metadata jsonb,

  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  label text,
  recipient_name text not null,
  phone text not null,

  governorate_id uuid not null
    references public.governorates(id)
    on delete restrict,

  city text not null,
  area text not null,
  street text not null,

  building text,
  floor text,
  apartment text,
  landmark text,
  notes text,

  is_default boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete restrict,

  address_id uuid
    references public.addresses(id)
    on delete set null,

  status text not null default 'pending_confirmation'
    check (
      status in (
        'pending_confirmation',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
        'return_requested'
      )
    ),

  payment_method text not null
    check (
      payment_method in (
        'cod',
        'paymob',
        'fawry'
      )
    ),

  subtotal numeric(12,2) not null
    check (subtotal >= 0),

  shipping_fee numeric(12,2) not null default 0
    check (shipping_fee >= 0),

  total numeric(12,2) not null
    check (total >= 0),

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  product_variant_id uuid
    references public.product_variants(id)
    on delete set null,

  product_name text not null,
  variant_name text,

  unit_price numeric(12,2) not null
    check (unit_price >= 0),

  quantity integer not null
    check (quantity > 0),

  line_total numeric(12,2) not null
    check (line_total >= 0),

  created_at timestamptz not null default now()
);

create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  provider text not null
    check (
      provider in (
        'paymob',
        'fawry'
      )
    ),

  provider_transaction_id text,

  amount numeric(12,2) not null
    check (amount >= 0),

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'paid',
        'failed',
        'refunded'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.decrement_stock(
  p_variant_id uuid,
  p_quantity integer
)
returns boolean
language plpgsql
as $$
begin
  update public.product_variants
  set stock_quantity = stock_quantity - p_quantity
  where id = p_variant_id
    and stock_quantity >= p_quantity;

  return found;
end;
$$;

CREATE OR REPLACE FUNCTION public.search_products_fuzzy(search_query text)
RETURNS TABLE (
    id uuid,
    name text,
    slug text,
    description text,
    base_price numeric,
    brand_name text,
    brand_slug text,
    category_name text,
    category_slug text
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.base_price,
        b.name AS brand_name,
        b.slug AS brand_slug,
        c.name AS category_name,
        c.slug AS category_slug
    FROM public.products p
    LEFT JOIN public.brands b ON b.id = p.brand_id
    LEFT JOIN public.categories c ON c.id = p.category_id
    WHERE p.is_active = true
      AND length(trim(search_query)) >= 2
      AND (
    p.name ILIKE '%' || trim(search_query) || '%'
    OR extensions.similarity(p.name, trim(search_query)) >= 0.15
    OR EXISTS (
        SELECT 1
        FROM public.categories c2
        WHERE c2.id = p.category_id
          AND (
                        c2.name ILIKE '%' || trim(search_query) || '%'
                        OR extensions.similarity(c2.name, trim(search_query)) >= 0.15
                    )
                )
            )
    ORDER BY
        CASE
            WHEN p.name ILIKE '%' || trim(search_query) || '%' THEN 0
            ELSE 1
        END,
        extensions.similarity(p.name, trim(search_query)) DESC,
        p.name
    LIMIT 24;
$$;

CREATE OR REPLACE FUNCTION public.search_suggestions_fuzzy(
    search_query text
)
RETURNS TABLE (
    name text
)
LANGUAGE sql
STABLE
AS $$
    SELECT p.name
    FROM public.products p
    WHERE p.is_active = true
      AND length(trim(search_query)) >= 2
      AND (
          p.name ILIKE '%' || trim(search_query) || '%'
          OR extensions.similarity(p.name, trim(search_query)) >= 0.15
      )
    ORDER BY
        CASE
            WHEN p.name ILIKE '%' || trim(search_query) || '%' THEN 0
            ELSE 1
        END,
        extensions.similarity(p.name, trim(search_query)) DESC,
        p.name
    LIMIT 10;
$$;

CREATE OR REPLACE FUNCTION public.search_brands_fuzzy(
    search_query text
)
RETURNS TABLE (
    id uuid,
    name text
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        b.id,
        b.name
    FROM public.brands b
    WHERE length(trim(search_query)) >= 2
      AND (
          b.name ILIKE '%' || trim(search_query) || '%'
          OR extensions.similarity(b.name, trim(search_query)) >= 0.15
      )
    ORDER BY
        CASE
            WHEN b.name ILIKE '%' || trim(search_query) || '%' THEN 0
            ELSE 1
        END,
        extensions.similarity(b.name, trim(search_query)) DESC,
        b.name
    LIMIT 10;
$$;


CREATE OR REPLACE FUNCTION public.search_categories_fuzzy(
    search_query text
)
RETURNS TABLE (
    id uuid,
    name text
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        c.id,
        c.name
    FROM public.categories c
    WHERE length(trim(search_query)) >= 2
      AND (
          c.name ILIKE '%' || trim(search_query) || '%'
          OR extensions.similarity(c.name, trim(search_query)) >= 0.15
      )
    ORDER BY
        CASE
            WHEN c.name ILIKE '%' || trim(search_query) || '%' THEN 0
            ELSE 1
        END,
        extensions.similarity(c.name, trim(search_query)) DESC,
        c.name
    LIMIT 10;
$$;
