// ============================================
// MOTION POSTER ATELIER — TypeScript Types
// ============================================

export type UserRole = "client" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  role: UserRole;
  bio: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  description: string | null;
  full_description: string | null;
  cover_image_url: string | null;
  cover_video_url: string | null;
  preview_gif_url: string | null;
  gallery_urls: string[];
  video_urls: string[];
  storyboard_urls: string[];
  client: string | null;
  year: number | null;
  tags: string[];
  tools_used: string[];
  color_palette: string[];
  brief_summary: string | null;
  design_process: string | null;
  deliverables: string[];
  behind_the_scenes: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  aspect_ratio: string;
  format: string;
  created_at: string;
  updated_at: string;
  // Joined
  category?: PortfolioCategory;
}

export type ProjectType =
  | "poster_design"
  | "animated_poster"
  | "teaser_visual"
  | "social_campaign"
  | "event_visuals"
  | "album_artwork"
  | "motion_typography"
  | "title_sequence"
  | "key_visual"
  | "other";

export type CommissionStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "quoted"
  | "approved"
  | "in_progress"
  | "revision"
  | "delivered"
  | "completed"
  | "cancelled";

export interface CommissionRequest {
  id: string;
  user_id: string | null;
  package_id: string | null;
  project_title: string;
  project_type: ProjectType;
  creative_brief: string | null;
  target_audience: string | null;
  tone_mood: string | null;
  aspect_ratio: string;
  export_formats: string[];
  animation_duration: string | null;
  budget_range: string | null;
  deadline: string | null;
  usage_rights: string | null;
  licensing_requirements: string | null;
  revision_count: number;
  delivery_expectations: string | null;
  client_name: string | null;
  client_email: string | null;
  client_company: string | null;
  status: CommissionStatus;
  is_draft: boolean;
  agreement_accepted: boolean;
  agreement_accepted_at: string | null;
  admin_notes: string | null;
  quoted_price: number | null;
  quoted_at: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  // Joined
  package?: Package;
  uploaded_assets?: UploadedAsset[];
}

export interface CommissionDraft {
  id: string;
  user_id: string;
  commission_id: string | null;
  step_data: Record<string, unknown>;
  current_step: number;
  last_saved: string;
}

export interface Package {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  price_from: number;
  price_to: number | null;
  currency: string;
  delivery_days: number | null;
  revisions: number;
  features: string[];
  deliverables: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface UploadedAsset {
  id: string;
  user_id: string | null;
  commission_id: string | null;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  storage_path: string;
  public_url: string | null;
  asset_type: "moodboard" | "reference" | "brand_asset" | "deliverable" | "other";
  created_at: string;
}

export interface ProjectStatusUpdate {
  id: string;
  commission_id: string;
  status: string;
  title: string;
  description: string | null;
  created_by: string | null;
  is_visible_to_client: boolean;
  created_at: string;
}

export interface Revision {
  id: string;
  commission_id: string;
  requested_by: string | null;
  revision_number: number;
  feedback: string;
  attachments: string[];
  status: "open" | "in_review" | "applied" | "declined";
  admin_response: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface Message {
  id: string;
  commission_id: string;
  sender_id: string | null;
  content: string;
  attachments: string[];
  is_read: boolean;
  created_at: string;
  // Joined
  sender?: Profile;
}

export interface Download {
  id: string;
  commission_id: string;
  user_id: string | null;
  file_name: string;
  file_description: string | null;
  storage_path: string;
  public_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  download_count: number;
  expires_at: string | null;
  created_at: string;
}

export interface Agreement {
  id: string;
  commission_id: string;
  user_id: string | null;
  agreement_type: "commission" | "license" | "nda";
  pdf_url: string | null;
  signed_at: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_role: string | null;
  client_company: string | null;
  client_avatar_url: string | null;
  content: string;
  rating: number | null;
  project_type: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface CommissionFormStep1 {
  project_title: string;
  project_type: ProjectType;
  package_id?: string;
  client_name: string;
  client_email: string;
  client_company?: string;
}

export interface CommissionFormStep2 {
  creative_brief: string;
  target_audience: string;
  tone_mood: string;
}

export interface CommissionFormStep3 {
  aspect_ratio: string;
  export_formats: string[];
  animation_duration?: string;
  deliverables?: string[];
}

export interface CommissionFormStep4 {
  budget_range: string;
  deadline: string;
  usage_rights: string;
  licensing_requirements?: string;
  revision_count: number;
  delivery_expectations?: string;
}

export interface CommissionFormStep5 {
  moodboard_files?: File[];
  reference_files?: File[];
  brand_asset_files?: File[];
}

export interface CommissionFormStep6 {
  agreement_accepted: boolean;
}

export type CommissionFormData = CommissionFormStep1 &
  CommissionFormStep2 &
  CommissionFormStep3 &
  CommissionFormStep4 &
  CommissionFormStep6;
