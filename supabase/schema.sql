-- ============================================
-- MOTION POSTER ATELIER — Supabase Schema
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- PORTFOLIO CATEGORIES
-- ============================================
CREATE TABLE public.portfolio_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO public.portfolio_categories (name, slug, sort_order) VALUES
  ('Poster Design', 'poster-design', 1),
  ('Key Visuals', 'key-visuals', 2),
  ('Motion Posters', 'motion-posters', 3),
  ('Campaign Graphics', 'campaign-graphics', 4),
  ('Title Sequences', 'title-sequences', 5),
  ('Album Artwork', 'album-artwork', 6),
  ('Event Visuals', 'event-visuals', 7),
  ('Motion Typography', 'motion-typography', 8);

-- ============================================
-- PORTFOLIO ITEMS
-- ============================================
CREATE TABLE public.portfolio_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES public.portfolio_categories(id),
  description TEXT,
  full_description TEXT,

  -- Media
  cover_image_url TEXT,
  cover_video_url TEXT,
  preview_gif_url TEXT,
  gallery_urls JSONB DEFAULT '[]'::JSONB,
  video_urls JSONB DEFAULT '[]'::JSONB,
  storyboard_urls JSONB DEFAULT '[]'::JSONB,

  -- Metadata
  client TEXT,
  year INTEGER,
  tags TEXT[] DEFAULT '{}',
  tools_used TEXT[] DEFAULT '{}',
  color_palette TEXT[] DEFAULT '{}',

  -- Process
  brief_summary TEXT,
  design_process TEXT,
  deliverables TEXT[] DEFAULT '{}',
  behind_the_scenes TEXT,

  -- Display
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,

  -- Dimensions
  aspect_ratio TEXT DEFAULT '16:9',
  format TEXT DEFAULT 'digital',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published items visible to all"
  ON public.portfolio_items FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Admins can manage all portfolio items"
  ON public.portfolio_items FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- PACKAGES (Commission Tiers)
-- ============================================
CREATE TABLE public.packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price_from INTEGER NOT NULL,  -- in cents
  price_to INTEGER,
  currency TEXT DEFAULT 'USD',
  delivery_days INTEGER,
  revisions INTEGER DEFAULT 2,
  features JSONB DEFAULT '[]'::JSONB,
  deliverables JSONB DEFAULT '[]'::JSONB,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default packages
INSERT INTO public.packages (name, tagline, price_from, price_to, delivery_days, revisions, is_popular, sort_order, features, deliverables) VALUES
(
  'Essentials',
  'Single poster, maximum impact',
  80000, 150000,
  7, 2, FALSE, 1,
  '["1 static poster design", "High-resolution exports", "2 rounds of revisions", "Print + digital ready files", "Basic usage license"]'::JSONB,
  '["1x Poster (A2/A3)", "Print-ready PDF", "Web-optimized JPG/PNG", "Brand fonts + color codes"]'::JSONB
),
(
  'Studio',
  'Full campaign visual system',
  200000, 400000,
  14, 3, TRUE, 2,
  '["Up to 3 poster variants", "Motion poster (15s loop)", "Social media adaptations", "3 rounds of revisions", "Extended usage license", "Source files included"]'::JSONB,
  '["3x Poster variants", "1x Motion poster (MP4/GIF)", "Social kit (Story, Feed, Banner)", "Source files (PSD/AI)", "Usage license document"]'::JSONB
),
(
  'Atelier',
  'Cinematic visual universe',
  500000, NULL,
  30, 5, FALSE, 3,
  '["Full visual identity system", "Animated campaign suite", "Title sequence (30s+)", "Color graded motion posters", "Unlimited revisions", "Full ownership transfer", "Priority support", "Archive access"]'::JSONB,
  '["Full visual identity system", "5+ Poster series", "Motion poster suite", "Title sequence", "Campaign toolkit", "Source files (all formats)", "Full IP transfer"]'::JSONB
);

-- ============================================
-- COMMISSION REQUESTS
-- ============================================
CREATE TABLE public.commission_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  package_id UUID REFERENCES public.packages(id),

  -- Project Info
  project_title TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN (
    'poster_design', 'animated_poster', 'teaser_visual',
    'social_campaign', 'event_visuals', 'album_artwork',
    'motion_typography', 'title_sequence', 'key_visual', 'other'
  )),

  -- Brief
  creative_brief TEXT,
  target_audience TEXT,
  tone_mood TEXT,

  -- Technical specs
  aspect_ratio TEXT DEFAULT '16:9',
  export_formats TEXT[] DEFAULT '{}',
  animation_duration TEXT,

  -- Budget & timeline
  budget_range TEXT,
  deadline DATE,
  usage_rights TEXT,
  licensing_requirements TEXT,

  -- Revisions & delivery
  revision_count INTEGER DEFAULT 2,
  delivery_expectations TEXT,

  -- Client info
  client_name TEXT,
  client_email TEXT,
  client_company TEXT,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'reviewing', 'quoted',
    'approved', 'in_progress', 'revision', 'delivered', 'completed', 'cancelled'
  )),
  is_draft BOOLEAN DEFAULT TRUE,

  -- Agreement
  agreement_accepted BOOLEAN DEFAULT FALSE,
  agreement_accepted_at TIMESTAMPTZ,

  -- Internal
  admin_notes TEXT,
  quoted_price INTEGER,  -- in cents
  quoted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

ALTER TABLE public.commission_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own commissions"
  ON public.commission_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create commissions"
  ON public.commission_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their draft commissions"
  ON public.commission_requests FOR UPDATE
  USING (auth.uid() = user_id AND is_draft = TRUE);

CREATE POLICY "Admins can manage all commissions"
  ON public.commission_requests FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- COMMISSION DRAFTS (step-by-step form saves)
-- ============================================
CREATE TABLE public.commission_drafts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  commission_id UUID REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  step_data JSONB DEFAULT '{}'::JSONB,
  current_step INTEGER DEFAULT 1,
  last_saved TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.commission_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own drafts"
  ON public.commission_drafts FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- UPLOADED ASSETS
-- ============================================
CREATE TABLE public.uploaded_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  commission_id UUID REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  asset_type TEXT CHECK (asset_type IN ('moodboard', 'reference', 'brand_asset', 'deliverable', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.uploaded_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assets"
  ON public.uploaded_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload assets"
  ON public.uploaded_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PROJECT STATUS UPDATES
-- ============================================
CREATE TABLE public.project_status_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commission_id UUID REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_visible_to_client BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.project_status_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view updates for their projects"
  ON public.project_status_updates FOR SELECT
  USING (
    is_visible_to_client = TRUE AND
    EXISTS (
      SELECT 1 FROM public.commission_requests
      WHERE id = commission_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage status updates"
  ON public.project_status_updates FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- REVISIONS
-- ============================================
CREATE TABLE public.revisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commission_id UUID REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES auth.users(id),
  revision_number INTEGER NOT NULL,
  feedback TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::JSONB,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'applied', 'declined')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and create revisions for their projects"
  ON public.revisions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.commission_requests
      WHERE id = commission_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can submit revisions"
  ON public.revisions FOR INSERT
  WITH CHECK (
    auth.uid() = requested_by AND
    EXISTS (
      SELECT 1 FROM public.commission_requests
      WHERE id = commission_id AND user_id = auth.uid()
    )
  );

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commission_id UUID REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their commissions"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.commission_requests
      WHERE id = commission_id AND user_id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can send messages in their commissions"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    (
      EXISTS (
        SELECT 1 FROM public.commission_requests
        WHERE id = commission_id AND user_id = auth.uid()
      )
      OR
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- ============================================
-- DOWNLOADS (Deliverables)
-- ============================================
CREATE TABLE public.downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commission_id UUID REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_description TEXT,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their deliverables"
  ON public.downloads FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- AGREEMENTS
-- ============================================
CREATE TABLE public.agreements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  commission_id UUID REFERENCES public.commission_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  agreement_type TEXT DEFAULT 'commission' CHECK (agreement_type IN ('commission', 'license', 'nda')),
  pdf_url TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their agreements"
  ON public.agreements FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- TESTIMONIALS
-- ============================================
CREATE TABLE public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_role TEXT,
  client_company TEXT,
  client_avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  project_type TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published testimonials visible to all"
  ON public.testimonials FOR SELECT
  USING (is_published = TRUE);

-- Seed testimonials
INSERT INTO public.testimonials (client_name, client_role, client_company, content, rating, project_type, is_featured, is_published, sort_order) VALUES
(
  'Yuki Tanaka',
  'Creative Director',
  'Neon Records',
  'The motion poster they created for our album launch was unlike anything I had seen. The layering, the typography, the movement — every frame was intentional. It tripled our pre-save numbers.',
  5, 'Album Artwork + Motion Poster', TRUE, TRUE, 1
),
(
  'Sofia Reinholt',
  'Brand Director',
  'ARCH Festival',
  'We needed something that could carry the weight of a 10-year anniversary. The visual system they built was monumental — cinematic, textured, alive. Our audience has never responded so emotionally.',
  5, 'Event Visuals + Campaign', TRUE, TRUE, 2
),
(
  'Marcus Webb',
  'Producer',
  'VOID Films',
  'From brief to delivery, the process was immaculate. The title sequence elevated the entire project. We have extended the engagement for two more features.',
  5, 'Title Sequence', TRUE, TRUE, 3
),
(
  'Amara Osei',
  'Marketing Lead',
  'Capsule Studio',
  'The campaign graphics were ready on time and on brand — but beyond that, they exceeded every creative brief we gave. The team genuinely cares about the work.',
  5, 'Campaign Graphics', FALSE, TRUE, 4
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_portfolio_items_category ON public.portfolio_items(category_id);
CREATE INDEX idx_portfolio_items_featured ON public.portfolio_items(is_featured, is_published);
CREATE INDEX idx_portfolio_items_slug ON public.portfolio_items(slug);
CREATE INDEX idx_commission_requests_user ON public.commission_requests(user_id);
CREATE INDEX idx_commission_requests_status ON public.commission_requests(status);
CREATE INDEX idx_messages_commission ON public.messages(commission_id);
CREATE INDEX idx_status_updates_commission ON public.project_status_updates(commission_id);
CREATE INDEX idx_downloads_user ON public.downloads(user_id);

-- ============================================
-- STORAGE BUCKETS (run in Supabase dashboard)
-- ============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('commission-uploads', 'commission-uploads', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('deliverables', 'deliverables', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('agreements', 'agreements', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
