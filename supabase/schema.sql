-- ============================================================
-- CelebApp — Schema Database Supabase
-- Esegui questo script nel SQL Editor di Supabase
-- ============================================================

-- Estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABELLA: users (estende auth.users di Supabase)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  email           TEXT NOT NULL,
  avatar_url      TEXT,
  stripe_account_id        TEXT UNIQUE,
  stripe_account_verified  BOOLEAN DEFAULT FALSE,
  plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: crea automaticamente il profilo utente al signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TABELLA: events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('birthday', 'wedding', 'graduation', 'baptism', 'other')),
  date             DATE NOT NULL,
  description      TEXT,
  cover_image_url  TEXT,
  slug             TEXT NOT NULL UNIQUE,
  iban             TEXT,
  bank_owner_name  TEXT,
  is_public        BOOLEAN DEFAULT TRUE,
  theme            TEXT CHECK (theme IN ('purple', 'rose', 'indigo', 'emerald', 'amber')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_user_id_idx ON public.events(user_id);
CREATE INDEX IF NOT EXISTS events_slug_idx ON public.events(slug);

-- ============================================================
-- TABELLA: wish_items
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wish_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id              UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  description           TEXT,
  price                 DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url             TEXT,
  shop_name             TEXT,
  shop_url              TEXT,
  type                  TEXT NOT NULL DEFAULT 'single' CHECK (type IN ('single', 'collective')),
  status                TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'partially_funded', 'fully_funded', 'purchased', 'reserved')),
  reserved_by_name      TEXT,
  reserved_by_email     TEXT,
  collected_amount      DECIMAL(10,2) DEFAULT 0,
  contributors_count    INTEGER DEFAULT 0,
  suggested_contribution DECIMAL(10,2),
  sort_order            INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wish_items_event_id_idx ON public.wish_items(event_id);

-- ============================================================
-- TABELLA: contributions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contributions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish_item_id              UUID NOT NULL REFERENCES public.wish_items(id) ON DELETE CASCADE,
  contributor_name          TEXT NOT NULL,
  contributor_email         TEXT NOT NULL,
  amount                    DECIMAL(10,2) NOT NULL,
  message                   TEXT,
  stripe_payment_intent_id  TEXT UNIQUE,
  status                    TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contributions_wish_item_id_idx ON public.contributions(wish_item_id);

-- ============================================================
-- TABELLA: payouts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payouts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_id         UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  wish_item_id     UUID REFERENCES public.wish_items(id) ON DELETE SET NULL,
  amount           DECIMAL(10,2) NOT NULL,
  stripe_payout_id TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed')),
  note             TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payouts_user_id_idx ON public.payouts(user_id);

-- ============================================================
-- TABELLA: messages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sender_name  TEXT NOT NULL,
  sender_email TEXT,
  content      TEXT NOT NULL,
  is_public    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_event_id_idx ON public.messages(event_id);

-- ============================================================
-- TABELLA: subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT UNIQUE NOT NULL,
  plan                    TEXT NOT NULL DEFAULT 'premium' CHECK (plan IN ('free', 'premium')),
  status                  TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_end      TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Abilita RLS su tutte le tabelle
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- USERS: ogni utente vede e modifica solo il proprio profilo
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- EVENTS: il proprietario può fare tutto; tutti possono leggere gli eventi pubblici
CREATE POLICY "events_select_public" ON public.events
  FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id);
CREATE POLICY "events_insert_own" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "events_update_own" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "events_delete_own" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- WISH ITEMS: leggibili se l'evento è pubblico; modificabili solo dal proprietario dell'evento
CREATE POLICY "wish_items_select" ON public.wish_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_id AND (e.is_public = TRUE OR e.user_id = auth.uid())
    )
  );
CREATE POLICY "wish_items_insert_own" ON public.wish_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid())
  );
CREATE POLICY "wish_items_update_own" ON public.wish_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid())
  );
CREATE POLICY "wish_items_update_reservation" ON public.wish_items
  FOR UPDATE USING (
    -- Anche gli anonimi possono prenotare (aggiorna reserved_by_*)
    EXISTS (
      SELECT 1 FROM public.events e WHERE e.id = event_id AND e.is_public = TRUE
    )
  );
CREATE POLICY "wish_items_delete_own" ON public.wish_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid())
  );

-- CONTRIBUTIONS: chiunque può inserire; il proprietario vede tutto
CREATE POLICY "contributions_insert" ON public.contributions
  FOR INSERT WITH CHECK (TRUE); -- Consentito da chiunque (pagamento verificato da Stripe webhook)
CREATE POLICY "contributions_select_owner" ON public.contributions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.wish_items wi
      JOIN public.events e ON e.id = wi.event_id
      WHERE wi.id = wish_item_id AND e.user_id = auth.uid()
    )
  );

-- PAYOUTS: solo il proprietario
CREATE POLICY "payouts_own" ON public.payouts
  FOR ALL USING (auth.uid() = user_id);

-- MESSAGES: chiunque può inserire; il proprietario vede tutto; gli altri vedono solo i pubblici
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.is_public = TRUE)
  );
CREATE POLICY "messages_select_public" ON public.messages
  FOR SELECT USING (
    is_public = TRUE
    OR EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid())
  );
CREATE POLICY "messages_update_owner" ON public.messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid())
  );
CREATE POLICY "messages_delete_owner" ON public.messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid())
  );

-- SUBSCRIPTIONS: solo il proprietario
CREATE POLICY "subscriptions_own" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE: bucket per immagini
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('wishday', 'wishday', true)
ON CONFLICT (id) DO NOTHING;

-- Policy storage: chiunque può leggere; solo autenticati possono caricare
CREATE POLICY "storage_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'wishday');
CREATE POLICY "storage_insert_auth" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'wishday' AND auth.role() = 'authenticated');
CREATE POLICY "storage_delete_own" ON storage.objects
  FOR DELETE USING (bucket_id = 'wishday' AND auth.uid()::text = (storage.foldername(name))[1]);
