-- Aggiunge dati fiscali/fatturazione alla tabella users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS billing_name TEXT,
  ADD COLUMN IF NOT EXISTS billing_address JSONB,
  ADD COLUMN IF NOT EXISTS tax_id TEXT;
