
-- Add size_stock column to store stock per size as JSONB (e.g. {"P": 10, "M": 20, "G": 15, "GG": 5})
ALTER TABLE public.products ADD COLUMN size_stock jsonb DEFAULT '{}'::jsonb;
