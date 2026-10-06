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