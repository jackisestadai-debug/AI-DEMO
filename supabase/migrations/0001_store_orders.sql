create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  address text not null,
  postal_code text not null,
  city text not null,
  total_sek integer not null,
  status text not null default 'pending_payment',
  stripe_session_id text,
  items jsonb not null default '[]'::jsonb
);

alter table public.orders enable row level security;

-- Orders are written by the server via the service role key (app/api/checkout),
-- never directly by the browser. No policies are created, so anon/authenticated
-- clients have zero access to this table by default.
