-- Migrazione: aggiunge la colonna invite_image_url alla tabella events
-- Eseguire nel SQL Editor di Supabase (https://supabase.com/dashboard → SQL Editor)

ALTER TABLE events ADD COLUMN IF NOT EXISTS invite_image_url TEXT;
