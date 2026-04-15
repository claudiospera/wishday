-- Migrazione: aggiunge colonne invite_template e invite_palette alla tabella events
-- Eseguire nel SQL Editor di Supabase (https://supabase.com/dashboard → SQL Editor)

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS invite_template TEXT NOT NULL DEFAULT 'botanico',
  ADD COLUMN IF NOT EXISTS invite_palette  INTEGER NOT NULL DEFAULT 0;

-- Bucket per immagini di sfondo personalizzate degli inviti
INSERT INTO storage.buckets (id, name, public)
VALUES ('invite-images', 'invite-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy storage bucket invite-images
CREATE POLICY "invite_images_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'invite-images');

CREATE POLICY "invite_images_insert_auth" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'invite-images' AND auth.role() = 'authenticated');

CREATE POLICY "invite_images_delete_own" ON storage.objects
  FOR DELETE USING (bucket_id = 'invite-images' AND auth.uid()::text = (storage.foldername(name))[1]);
