-- Aggiunge la colonna interval alla tabella subscriptions
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS interval TEXT CHECK (interval IN ('monthly', 'yearly'));
