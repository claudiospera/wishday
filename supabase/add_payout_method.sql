-- Aggiunge metodo di payout e IBAN alla tabella users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS payout_method TEXT DEFAULT 'iban' CHECK (payout_method IN ('stripe', 'iban')),
  ADD COLUMN IF NOT EXISTS payout_iban TEXT,
  ADD COLUMN IF NOT EXISTS payout_bank_owner TEXT;
