-- Safe RLS Security Setup for Flow Application
-- This script safely enables Row Level Security on all main tables and creates appropriate policies
-- It handles existing policies gracefully by dropping them first

-- ============================================================================
-- 1. USER PROFILES TABLE
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. WORKFLOW TEMPLATES TABLE
-- ============================================================================

ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view public templates" ON public.workflow_templates;
DROP POLICY IF EXISTS "Users can view own templates" ON public.workflow_templates;
DROP POLICY IF EXISTS "Users can create templates" ON public.workflow_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON public.workflow_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON public.workflow_templates;

-- Users can view public templates
CREATE POLICY "Users can view public templates" ON public.workflow_templates
    FOR SELECT
    USING (is_public = true OR auth.uid() = author_id);

-- Users can view their own templates
CREATE POLICY "Users can view own templates" ON public.workflow_templates
    FOR SELECT
    USING (auth.uid() = author_id);

-- Users can create templates
CREATE POLICY "Users can create templates" ON public.workflow_templates
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON public.workflow_templates
    FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" ON public.workflow_templates
    FOR DELETE
    USING (auth.uid() = author_id);

-- ============================================================================
-- 3. WORKFLOW INSTANCES TABLE
-- ============================================================================

ALTER TABLE public.workflow_instances ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own workflows" ON public.workflow_instances;
DROP POLICY IF EXISTS "Users can create workflows" ON public.workflow_instances;
DROP POLICY IF EXISTS "Users can update own workflows" ON public.workflow_instances;
DROP POLICY IF EXISTS "Users can delete own workflows" ON public.workflow_instances;

-- Users can view their own workflows
CREATE POLICY "Users can view own workflows" ON public.workflow_instances
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create workflows
CREATE POLICY "Users can create workflows" ON public.workflow_instances
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own workflows
CREATE POLICY "Users can update own workflows" ON public.workflow_instances
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own workflows
CREATE POLICY "Users can delete own workflows" ON public.workflow_instances
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 4. WORKFLOW STEPS TABLE
-- ============================================================================

ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own workflow steps" ON public.workflow_steps;
DROP POLICY IF EXISTS "Users can create workflow steps" ON public.workflow_steps;
DROP POLICY IF EXISTS "Users can update workflow steps" ON public.workflow_steps;
DROP POLICY IF EXISTS "Users can delete workflow steps" ON public.workflow_steps;

-- Users can view steps for their own workflows
CREATE POLICY "Users can view own workflow steps" ON public.workflow_steps
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = workflow_instance_id 
            AND user_id = auth.uid()
        )
    );

-- Users can create steps for their own workflows
CREATE POLICY "Users can create workflow steps" ON public.workflow_steps
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = workflow_instance_id 
            AND user_id = auth.uid()
        )
    );

-- Users can update steps for their own workflows
CREATE POLICY "Users can update workflow steps" ON public.workflow_steps
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = workflow_instance_id 
            AND user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = workflow_instance_id 
            AND user_id = auth.uid()
        )
    );

-- Users can delete steps for their own workflows
CREATE POLICY "Users can delete workflow steps" ON public.workflow_steps
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = workflow_instance_id 
            AND user_id = auth.uid()
        )
    );

-- ============================================================================
-- 5. TOOLS TABLE
-- ============================================================================

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view tools" ON public.tools;
DROP POLICY IF EXISTS "Authenticated users can create tools" ON public.tools;
DROP POLICY IF EXISTS "Authenticated users can update tools" ON public.tools;
DROP POLICY IF EXISTS "Authenticated users can delete tools" ON public.tools;

-- Everyone can view tools (they're public)
CREATE POLICY "Everyone can view tools" ON public.tools
    FOR SELECT
    USING (true);

-- Only authenticated users can create tools
CREATE POLICY "Authenticated users can create tools" ON public.tools
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update tools
CREATE POLICY "Authenticated users can update tools" ON public.tools
    FOR UPDATE
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can delete tools
CREATE POLICY "Authenticated users can delete tools" ON public.tools
    FOR DELETE
    USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- 6. USER FAVORITES TABLE
-- ============================================================================

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can create own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.user_favorites;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites" ON public.user_favorites
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create own favorites" ON public.user_favorites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own favorites
CREATE POLICY "Users can update own favorites" ON public.user_favorites
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON public.user_favorites
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 7. ANALYTICS EVENTS TABLE
-- ============================================================================

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can create own analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can update own analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can delete own analytics" ON public.analytics_events;

-- Users can view their own analytics events
CREATE POLICY "Users can view own analytics" ON public.analytics_events
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own analytics events
CREATE POLICY "Users can create own analytics" ON public.analytics_events
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own analytics events
CREATE POLICY "Users can update own analytics" ON public.analytics_events
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own analytics events
CREATE POLICY "Users can delete own analytics" ON public.analytics_events
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 8. TEMPLATE REVIEWS TABLE
-- ============================================================================

ALTER TABLE public.template_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view public reviews" ON public.template_reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON public.template_reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.template_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.template_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.template_reviews;

-- Users can view public reviews
CREATE POLICY "Users can view public reviews" ON public.template_reviews
    FOR SELECT
    USING (true);

-- Users can view their own reviews
CREATE POLICY "Users can view own reviews" ON public.template_reviews
    FOR SELECT
    USING (auth.uid() = reviewer_id);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON public.template_reviews
    FOR INSERT
    WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON public.template_reviews
    FOR UPDATE
    USING (auth.uid() = reviewer_id)
    WITH CHECK (auth.uid() = reviewer_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON public.template_reviews
    FOR DELETE
    USING (auth.uid() = reviewer_id);

-- ============================================================================
-- 9. REVIEW VOTES TABLE
-- ============================================================================

ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own votes" ON public.review_votes;
DROP POLICY IF EXISTS "Users can create own votes" ON public.review_votes;
DROP POLICY IF EXISTS "Users can update own votes" ON public.review_votes;
DROP POLICY IF EXISTS "Users can delete own votes" ON public.review_votes;

-- Users can view their own votes
CREATE POLICY "Users can view own votes" ON public.review_votes
    FOR SELECT
    USING (auth.uid() = voter_id);

-- Users can create their own votes
CREATE POLICY "Users can create own votes" ON public.review_votes
    FOR INSERT
    WITH CHECK (auth.uid() = voter_id);

-- Users can update their own votes
CREATE POLICY "Users can update own votes" ON public.review_votes
    FOR UPDATE
    USING (auth.uid() = voter_id)
    WITH CHECK (auth.uid() = voter_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes" ON public.review_votes
    FOR DELETE
    USING (auth.uid() = voter_id);

-- ============================================================================
-- 10. TEMPLATE UPLOADS TABLE
-- ============================================================================

ALTER TABLE public.template_uploads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own uploads" ON public.template_uploads;
DROP POLICY IF EXISTS "Users can create own uploads" ON public.template_uploads;
DROP POLICY IF EXISTS "Users can update own uploads" ON public.template_uploads;
DROP POLICY IF EXISTS "Users can delete own uploads" ON public.template_uploads;

-- Users can view their own uploads
CREATE POLICY "Users can view own uploads" ON public.template_uploads
    FOR SELECT
    USING (auth.uid() = uploader_id);

-- Users can create their own uploads
CREATE POLICY "Users can create own uploads" ON public.template_uploads
    FOR INSERT
    WITH CHECK (auth.uid() = uploader_id);

-- Users can update their own uploads
CREATE POLICY "Users can update own uploads" ON public.template_uploads
    FOR UPDATE
    USING (auth.uid() = uploader_id)
    WITH CHECK (auth.uid() = uploader_id);

-- Users can delete their own uploads
CREATE POLICY "Users can delete own uploads" ON public.template_uploads
    FOR DELETE
    USING (auth.uid() = uploader_id);

-- ============================================================================
-- 11. FLOW RELATIONSHIPS TABLE (from nested flows)
-- ============================================================================

ALTER TABLE public.flow_relationships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own flow relationships" ON public.flow_relationships;
DROP POLICY IF EXISTS "Users can create flow relationships" ON public.flow_relationships;
DROP POLICY IF EXISTS "Users can update flow relationships" ON public.flow_relationships;
DROP POLICY IF EXISTS "Users can delete flow relationships" ON public.flow_relationships;

-- Users can view relationships for their own workflows
CREATE POLICY "Users can view own flow relationships" ON public.flow_relationships
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = parent_flow_id 
            AND user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = child_flow_id 
            AND user_id = auth.uid()
        )
    );

-- Users can create relationships for their own workflows
CREATE POLICY "Users can create flow relationships" ON public.flow_relationships
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = parent_flow_id 
            AND user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = child_flow_id 
            AND user_id = auth.uid()
        )
    );

-- Users can update relationships for their own workflows
CREATE POLICY "Users can update flow relationships" ON public.flow_relationships
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = parent_flow_id 
            AND user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = child_flow_id 
            AND user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = parent_flow_id 
            AND user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = child_flow_id 
            AND user_id = auth.uid()
        )
    );

-- Users can delete relationships for their own workflows
CREATE POLICY "Users can delete flow relationships" ON public.flow_relationships
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = parent_flow_id 
            AND user_id = auth.uid()
        )
        AND
        EXISTS (
            SELECT 1 FROM public.workflow_instances 
            WHERE id = child_flow_id 
            AND user_id = auth.uid()
        )
    );

-- ============================================================================
-- 12. NESTED FLOW TEMPLATES TABLE
-- ============================================================================

ALTER TABLE public.nested_flow_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view public nested templates" ON public.nested_flow_templates;
DROP POLICY IF EXISTS "Users can view own nested templates" ON public.nested_flow_templates;
DROP POLICY IF EXISTS "Users can create nested templates" ON public.nested_flow_templates;
DROP POLICY IF EXISTS "Users can update own nested templates" ON public.nested_flow_templates;
DROP POLICY IF EXISTS "Users can delete own nested templates" ON public.nested_flow_templates;
DROP POLICY IF EXISTS "Moderators can view all templates" ON public.nested_flow_templates;
DROP POLICY IF EXISTS "Moderators can update template status" ON public.nested_flow_templates;

-- Users can view public templates
CREATE POLICY "Users can view public nested templates" ON public.nested_flow_templates
    FOR SELECT
    USING (is_public = true OR auth.uid() = author_id);

-- Users can view their own templates
CREATE POLICY "Users can view own nested templates" ON public.nested_flow_templates
    FOR SELECT
    USING (auth.uid() = author_id);

-- Users can create templates
CREATE POLICY "Users can create nested templates" ON public.nested_flow_templates
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Users can update their own templates
CREATE POLICY "Users can update own nested templates" ON public.nested_flow_templates
    FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Users can delete their own templates
CREATE POLICY "Users can delete own nested templates" ON public.nested_flow_templates
    FOR DELETE
    USING (auth.uid() = author_id);

-- Moderators can view all templates (for moderation purposes)
CREATE POLICY "Moderators can view all templates" ON public.nested_flow_templates
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND role = 'moderator'
        )
    );

-- Moderators can update template status
CREATE POLICY "Moderators can update template status" ON public.nested_flow_templates
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND role = 'moderator'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND role = 'moderator'
        )
    );

-- ============================================================================
-- 13. FLOW TEMPLATE RELATIONSHIPS TABLE
-- ============================================================================

ALTER TABLE public.flow_template_relationships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view template relationships" ON public.flow_template_relationships;
DROP POLICY IF EXISTS "Users can create template relationships" ON public.flow_template_relationships;
DROP POLICY IF EXISTS "Users can update template relationships" ON public.flow_template_relationships;
DROP POLICY IF EXISTS "Users can delete template relationships" ON public.flow_template_relationships;

-- Users can view relationships for templates they can access
CREATE POLICY "Users can view template relationships" ON public.flow_template_relationships
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = parent_template_id 
            AND (is_public = true OR auth.uid() = author_id)
        )
        OR
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = child_template_id 
            AND (is_public = true OR auth.uid() = author_id)
        )
    );

-- Users can create relationships for their own templates
CREATE POLICY "Users can create template relationships" ON public.flow_template_relationships
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = parent_template_id 
            AND auth.uid() = author_id
        )
        AND
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = child_template_id 
            AND auth.uid() = author_id
        )
    );

-- Users can update relationships for their own templates
CREATE POLICY "Users can update template relationships" ON public.flow_template_relationships
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = parent_template_id 
            AND auth.uid() = author_id
        )
        AND
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = child_template_id 
            AND auth.uid() = author_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = parent_template_id 
            AND auth.uid() = author_id
        )
        AND
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = child_template_id 
            AND auth.uid() = author_id
        )
    );

-- Users can delete relationships for their own templates
CREATE POLICY "Users can delete template relationships" ON public.flow_template_relationships
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = parent_template_id 
            AND auth.uid() = author_id
        )
        AND
        EXISTS (
            SELECT 1 FROM public.nested_flow_templates 
            WHERE id = child_template_id 
            AND auth.uid() = author_id
        )
    );

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to automatically set author_id on insert for templates
CREATE OR REPLACE FUNCTION public.handle_template_author()
RETURNS TRIGGER AS $$
BEGIN
    -- Set author_id to current user if not provided
    IF NEW.author_id IS NULL THEN
        NEW.author_id = auth.uid();
    END IF;
    
    -- Set author_name if not provided
    IF NEW.author_name IS NULL OR NEW.author_name = '' THEN
        SELECT COALESCE(full_name, email) INTO NEW.author_name
        FROM public.user_profiles
        WHERE id = NEW.author_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at columns
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
        AND table_name IN (
            'user_profiles', 'workflow_templates', 'workflow_instances', 
            'workflow_steps', 'tools', 'user_favorites', 'analytics_events',
            'template_reviews', 'review_votes', 'template_uploads',
            'flow_relationships', 'nested_flow_templates', 'flow_template_relationships'
        )
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON public.%I
                FOR EACH ROW
                EXECUTE FUNCTION public.update_updated_at();
        ', table_record.table_name, table_record.table_name, 
           table_record.table_name, table_record.table_name);
    END LOOP;
END $$;

-- Create triggers for author handling
DROP TRIGGER IF EXISTS set_template_author ON public.workflow_templates;
CREATE TRIGGER set_template_author
    BEFORE INSERT ON public.workflow_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_template_author();

DROP TRIGGER IF EXISTS set_nested_template_author ON public.nested_flow_templates;
CREATE TRIGGER set_nested_template_author
    BEFORE INSERT ON public.nested_flow_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_template_author();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
    'user_profiles', 'workflow_templates', 'workflow_instances', 
    'workflow_steps', 'tools', 'user_favorites', 'analytics_events',
    'template_reviews', 'review_votes', 'template_uploads',
    'flow_relationships', 'nested_flow_templates', 'flow_template_relationships'
)
ORDER BY tablename;

-- Show all policies created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname; 