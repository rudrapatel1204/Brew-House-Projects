-- ===================================================================
-- THE BREW HOUSE — SUPABASE DATABASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ===================================================================

-- 1. Table: Table Reservations
CREATE TABLE IF NOT EXISTS public.reservations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    guest_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    time_session TEXT NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 2,
    spatial_zone TEXT NOT NULL,
    special_notes TEXT,
    status TEXT DEFAULT 'Confirmed' NOT NULL
);

-- 2. Table: Newsletter Subscribers (The Secret Brew List)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    source TEXT DEFAULT 'Website Footer' NOT NULL
);

-- 3. Table: Table Orders (Order Tray Simulator)
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_code TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    customer_phone TEXT,
    status TEXT DEFAULT 'Received' NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts (so website visitors can submit forms)
CREATE POLICY "Allow public insert to reservations" 
ON public.reservations FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow public select from reservations" 
ON public.reservations FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow public insert to newsletter_subscribers" 
ON public.newsletter_subscribers FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow public select from newsletter_subscribers" 
ON public.newsletter_subscribers FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow public insert to orders" 
ON public.orders FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow public select from orders" 
ON public.orders FOR SELECT 
TO anon 
USING (true);

-- Helpful Sample Queries:
-- SELECT * FROM public.reservations ORDER BY created_at DESC;
-- SELECT * FROM public.newsletter_subscribers ORDER BY created_at DESC;
-- SELECT * FROM public.orders ORDER BY created_at DESC;
