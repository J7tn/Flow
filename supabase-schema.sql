-- Flow Application Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create custom types
CREATE TYPE workflow_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE template_category AS ENUM (
  'software-development', 'game-design', 'manufacturing', 'marketing',
  'business-operations', 'creative-projects', 'research-development',
  'customer-service', 'human-resources', 'finance', 'healthcare',
  'education', 'legal', 'real-estate', 'consulting', 'ecommerce',
  'content-creation', 'event-planning', 'product-management', 'quality-assurance'
);
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE cost_type AS ENUM (
  'fixed', 'variable', 'recurring', 'one-time', 'subscription',
  'licensing', 'infrastructure', 'labor', 'materials', 'overhead'
);
CREATE TYPE template_status AS ENUM ('draft', 'pending', 'approved', 'rejected');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow templates table
CREATE TABLE public.workflow_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category template_category NOT NULL,
  difficulty difficulty_level NOT NULL,
  estimated_duration_min INTEGER NOT NULL,
  estimated_duration_max INTEGER NOT NULL,
  duration_unit TEXT NOT NULL DEFAULT 'weeks',
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  version TEXT DEFAULT '1.0.0',
  author_id UUID REFERENCES public.user_profiles(id),
  author_name TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  steps JSONB NOT NULL DEFAULT '[]',
  cost_analysis JSONB NOT NULL DEFAULT '{}',
  recommended_tools JSONB NOT NULL DEFAULT '[]',
  optimization_suggestions JSONB NOT NULL DEFAULT '[]',
  industry_context JSONB NOT NULL DEFAULT '{}',
  success_metrics JSONB NOT NULL DEFAULT '[]',
  risks JSONB NOT NULL DEFAULT '[]',
  customization_options JSONB NOT NULL DEFAULT '[]',
  -- New fields for user-generated templates
  is_user_generated BOOLEAN DEFAULT false,
  status template_status DEFAULT 'pending',
  moderation_notes TEXT,
  moderated_by UUID REFERENCES public.user_profiles(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow instances table
CREATE TABLE public.workflow_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.workflow_templates(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status workflow_status DEFAULT 'draft',
  current_step INTEGER DEFAULT 0,
  completed_steps UUID[] DEFAULT '{}',
  customizations JSONB DEFAULT '{}',
  actual_costs JSONB,
  performance_metrics JSONB,
  notes JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow steps table
CREATE TABLE public.workflow_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_instance_id UUID REFERENCES public.workflow_instances(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  step_type TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  estimated_duration_min INTEGER,
  estimated_duration_max INTEGER,
  duration_unit TEXT DEFAULT 'days',
  required_skills TEXT[] DEFAULT '{}',
  required_tools TEXT[] DEFAULT '{}',
  dependencies UUID[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  acceptance_criteria TEXT[] DEFAULT '{}',
  risk_level TEXT DEFAULT 'medium',
  cost_estimate_min DECIMAL(10,2),
  cost_estimate_max DECIMAL(10,2),
  cost_currency TEXT DEFAULT 'USD',
  automation_potential INTEGER DEFAULT 0,
  optimization_tips TEXT[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools and technologies table
CREATE TABLE public.tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  pricing_model TEXT NOT NULL,
  starting_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  pricing_notes TEXT,
  features TEXT[] DEFAULT '{}',
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  alternatives TEXT[] DEFAULT '{}',
  integration_notes TEXT,
  learning_curve difficulty_level DEFAULT 'intermediate',
  popularity INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites and bookmarks
CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  template_id UUID REFERENCES public.workflow_templates(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, template_id),
  UNIQUE(user_id, tool_id),
  CHECK (template_id IS NOT NULL OR tool_id IS NOT NULL)
);

-- Analytics and usage tracking
CREATE TABLE public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template reviews table
CREATE TABLE public.template_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.workflow_templates(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  review_text TEXT NOT NULL,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  status review_status DEFAULT 'approved',
  moderated_by UUID REFERENCES public.user_profiles(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(template_id, reviewer_id)
);

-- Review helpful votes table
CREATE TABLE public.review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.template_reviews(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, voter_id)
);

-- Template uploads tracking table
CREATE TABLE public.template_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.workflow_templates(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  original_workflow_id UUID REFERENCES public.workflow_instances(id) ON DELETE SET NULL,
  upload_notes TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version_number INTEGER DEFAULT 1,
  is_latest_version BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX idx_workflow_templates_category ON public.workflow_templates(category);
CREATE INDEX idx_workflow_templates_difficulty ON public.workflow_templates(difficulty);
CREATE INDEX idx_workflow_templates_rating ON public.workflow_templates(rating);
CREATE INDEX idx_workflow_templates_usage_count ON public.workflow_templates(usage_count);
CREATE INDEX idx_workflow_templates_status ON public.workflow_templates(status);
CREATE INDEX idx_workflow_templates_author_id ON public.workflow_templates(author_id);
CREATE INDEX idx_workflow_templates_user_generated ON public.workflow_templates(is_user_generated);
CREATE INDEX idx_template_reviews_template_id ON public.template_reviews(template_id);
CREATE INDEX idx_template_reviews_reviewer_id ON public.template_reviews(reviewer_id);
CREATE INDEX idx_template_reviews_status ON public.template_reviews(status);
CREATE INDEX idx_template_reviews_rating ON public.template_reviews(rating);
CREATE INDEX idx_review_votes_review_id ON public.review_votes(review_id);
CREATE INDEX idx_review_votes_voter_id ON public.review_votes(voter_id);
CREATE INDEX idx_template_uploads_template_id ON public.template_uploads(template_id);
CREATE INDEX idx_template_uploads_uploader_id ON public.template_uploads(uploader_id);
CREATE INDEX idx_workflow_instances_user_id ON public.workflow_instances(user_id);
CREATE INDEX idx_workflow_instances_status ON public.workflow_instances(status);
CREATE INDEX idx_workflow_steps_instance_id ON public.workflow_steps(workflow_instance_id);
CREATE INDEX idx_workflow_steps_order ON public.workflow_steps(workflow_instance_id, order_index);
CREATE INDEX idx_tools_category ON public.tools(category);
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Workflow templates: public templates are viewable by all, private by owner
CREATE POLICY "Public templates are viewable by all" ON public.workflow_templates
  FOR SELECT USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Users can create templates" ON public.workflow_templates
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own templates" ON public.workflow_templates
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own templates" ON public.workflow_templates
  FOR DELETE USING (auth.uid() = author_id);

-- Template reviews: approved reviews are viewable by all, pending by reviewer
CREATE POLICY "Approved reviews are viewable by all" ON public.template_reviews
  FOR SELECT USING (status = 'approved' OR auth.uid() = reviewer_id);

CREATE POLICY "Users can create reviews" ON public.template_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews" ON public.template_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews" ON public.template_reviews
  FOR DELETE USING (auth.uid() = reviewer_id);

-- Review votes: users can only see their own votes
CREATE POLICY "Users can view own votes" ON public.review_votes
  FOR SELECT USING (auth.uid() = voter_id);

CREATE POLICY "Users can create votes" ON public.review_votes
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own votes" ON public.review_votes
  FOR UPDATE USING (auth.uid() = voter_id);

CREATE POLICY "Users can delete own votes" ON public.review_votes
  FOR DELETE USING (auth.uid() = voter_id);

-- Template uploads: users can only see their own uploads
CREATE POLICY "Users can view own uploads" ON public.template_uploads
  FOR SELECT USING (auth.uid() = uploader_id);

CREATE POLICY "Users can create uploads" ON public.template_uploads
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can update own uploads" ON public.template_uploads
  FOR UPDATE USING (auth.uid() = uploader_id);

-- Workflow instances: users can only see their own workflows
CREATE POLICY "Users can view own workflows" ON public.workflow_instances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create workflows" ON public.workflow_instances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workflows" ON public.workflow_instances
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflows" ON public.workflow_instances
  FOR DELETE USING (auth.uid() = user_id);

-- Workflow steps: users can only see steps from their own workflows
CREATE POLICY "Users can view own workflow steps" ON public.workflow_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workflow_instances 
      WHERE id = workflow_instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create workflow steps" ON public.workflow_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workflow_instances 
      WHERE id = workflow_instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workflow steps" ON public.workflow_steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workflow_instances 
      WHERE id = workflow_instance_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workflow steps" ON public.workflow_steps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workflow_instances 
      WHERE id = workflow_instance_id AND user_id = auth.uid()
    )
  );

-- Tools: all tools are viewable by all users
CREATE POLICY "Tools are viewable by all" ON public.tools
  FOR SELECT USING (true);

-- User favorites: users can only see their own favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics events: users can only see their own events, admins can see all
CREATE POLICY "Users can view own analytics" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create analytics events" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at BEFORE UPDATE ON public.workflow_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_instances_updated_at BEFORE UPDATE ON public.workflow_instances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_steps_updated_at BEFORE UPDATE ON public.workflow_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_reviews_updated_at BEFORE UPDATE ON public.template_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_uploads_updated_at BEFORE UPDATE ON public.template_uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update template rating when reviews change
CREATE OR REPLACE FUNCTION update_template_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the template's average rating
  UPDATE public.workflow_templates 
  SET rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM public.template_reviews 
    WHERE template_id = COALESCE(NEW.template_id, OLD.template_id)
    AND status = 'approved'
  )
  WHERE id = COALESCE(NEW.template_id, OLD.template_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update review helpful votes count
CREATE OR REPLACE FUNCTION update_review_helpful_votes()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the review's helpful votes count
  UPDATE public.template_reviews 
  SET helpful_votes = (
    SELECT COUNT(*)
    FROM public.review_votes 
    WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
    AND is_helpful = true
  )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update template rating when reviews change
CREATE TRIGGER update_template_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.template_reviews
  FOR EACH ROW EXECUTE FUNCTION update_template_rating();

-- Trigger to update review helpful votes when votes change
CREATE TRIGGER update_review_helpful_votes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.review_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_votes();

-- Insert some sample data
INSERT INTO public.tools (name, category, description, pricing_model, starting_price, features, pros, cons) VALUES
('Figma', 'design', 'Collaborative design tool for teams', 'freemium', 12, ARRAY['Real-time collaboration', 'Prototyping', 'Design systems'], ARRAY['Excellent collaboration', 'Free tier available', 'Industry standard'], ARRAY['Learning curve', 'Requires internet']),
('Notion', 'project-management', 'All-in-one workspace for notes and projects', 'freemium', 8, ARRAY['Database views', 'Templates', 'Integrations'], ARRAY['Very flexible', 'Great for teams', 'Free tier'], ARRAY['Can be overwhelming', 'Performance issues']),
('Slack', 'communication', 'Team communication platform', 'freemium', 7.25, ARRAY['Channels', 'Direct messages', 'Integrations'], ARRAY['Great for teams', 'Many integrations', 'Easy to use'], ARRAY['Can be distracting', 'Message retention limits']);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 