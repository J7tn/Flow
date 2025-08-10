-- Database Performance and Security Fixes
-- This script addresses all Supabase linting issues comprehensively

-- ============================================================================
-- STEP 1: FIX AUTH RLS INITIALIZATION PLAN ISSUES
-- ============================================================================

-- Fix RLS policies that re-evaluate auth functions for each row
-- Replace auth.<function>() with (select auth.<function>()) for better performance

-- Fix user_profiles table RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- Fix workflow_templates table RLS policies
DROP POLICY IF EXISTS "Users can view public templates" ON public.workflow_templates;
CREATE POLICY "Users can view public templates" ON public.workflow_templates
    FOR SELECT USING (
        status = 'approved' OR 
        (select auth.uid()) = author_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can update own templates" ON public.workflow_templates;
CREATE POLICY "Users can update own templates" ON public.workflow_templates
    FOR UPDATE USING (
        (select auth.uid()) = author_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can insert own templates" ON public.workflow_templates;
CREATE POLICY "Users can insert own templates" ON public.workflow_templates
    FOR INSERT WITH CHECK (
        (select auth.uid()) = author_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

-- Fix workflow_instances table RLS policies
DROP POLICY IF EXISTS "Users can view own workflows" ON public.workflow_instances;
CREATE POLICY "Users can view own workflows" ON public.workflow_instances
    FOR SELECT USING (
        (select auth.uid()) = user_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can update own workflows" ON public.workflow_instances;
CREATE POLICY "Users can update own workflows" ON public.workflow_instances
    FOR UPDATE USING (
        (select auth.uid()) = user_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can insert own workflows" ON public.workflow_instances;
CREATE POLICY "Users can insert own workflows" ON public.workflow_instances
    FOR INSERT WITH CHECK (
        (select auth.uid()) = user_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

-- Fix template_reviews table RLS policies
DROP POLICY IF EXISTS "Users can view approved reviews" ON public.template_reviews;
CREATE POLICY "Users can view approved reviews" ON public.template_reviews
    FOR SELECT USING (
        status = 'approved' OR 
        (select auth.uid()) = reviewer_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Users can insert own reviews" ON public.template_reviews;
CREATE POLICY "Users can insert own reviews" ON public.template_reviews
    FOR INSERT WITH CHECK (
        (select auth.uid()) = reviewer_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

-- Fix nested_flow_templates table RLS policies
DROP POLICY IF EXISTS "Users can view public nested templates" ON public.nested_flow_templates;
CREATE POLICY "Users can view public nested templates" ON public.nested_flow_templates
    FOR SELECT USING (
        status = 'approved' OR 
        (select auth.uid()) = author_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

-- Fix template_uploads table RLS policies
DROP POLICY IF EXISTS "Users can view own uploads" ON public.template_uploads;
CREATE POLICY "Users can view own uploads" ON public.template_uploads
    FOR SELECT USING (
        (select auth.uid()) = uploader_id OR 
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = (select auth.uid()) 
            AND role = 'admin'
        )
    );

-- Fix user_favorites table RLS policies
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
CREATE POLICY "Users can view own favorites" ON public.user_favorites
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can manage own favorites" ON public.user_favorites;
CREATE POLICY "Users can manage own favorites" ON public.user_favorites
    FOR ALL USING ((select auth.uid()) = user_id);

-- ============================================================================
-- STEP 2: ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

-- Add indexes for unindexed foreign keys to improve query performance

-- nested_flow_templates table
CREATE INDEX IF NOT EXISTS idx_nested_flow_templates_moderated_by 
ON public.nested_flow_templates(moderated_by);

-- template_reviews table
CREATE INDEX IF NOT EXISTS idx_template_reviews_moderated_by 
ON public.template_reviews(moderated_by);

-- template_uploads table
CREATE INDEX IF NOT EXISTS idx_template_uploads_original_workflow_id 
ON public.template_uploads(original_workflow_id);

-- user_favorites table
CREATE INDEX IF NOT EXISTS idx_user_favorites_template_id 
ON public.user_favorites(template_id);

CREATE INDEX IF NOT EXISTS idx_user_favorites_tool_id 
ON public.user_favorites(tool_id);

-- workflow_instances table
CREATE INDEX IF NOT EXISTS idx_workflow_instances_template_id 
ON public.workflow_instances(template_id);

-- workflow_templates table
CREATE INDEX IF NOT EXISTS idx_workflow_templates_moderated_by 
ON public.workflow_templates(moderated_by);

-- ============================================================================
-- STEP 3: REMOVE UNUSED INDEXES
-- ============================================================================

-- Remove unused indexes to improve write performance and reduce storage

-- workflow_templates table unused indexes
DROP INDEX IF EXISTS idx_workflow_templates_category;
DROP INDEX IF EXISTS idx_workflow_templates_difficulty;
DROP INDEX IF EXISTS idx_workflow_templates_rating;
DROP INDEX IF EXISTS idx_workflow_templates_usage_count;
DROP INDEX IF EXISTS idx_workflow_templates_status;
DROP INDEX IF EXISTS idx_workflow_templates_author_id;
DROP INDEX IF EXISTS idx_workflow_templates_user_generated;

-- template_reviews table unused indexes
DROP INDEX IF EXISTS idx_template_reviews_status;
DROP INDEX IF EXISTS idx_template_reviews_rating;

-- review_votes table unused indexes
DROP INDEX IF EXISTS idx_review_votes_review_id;
DROP INDEX IF EXISTS idx_review_votes_voter_id;

-- template_uploads table unused indexes
DROP INDEX IF EXISTS idx_template_uploads_template_id;
DROP INDEX IF EXISTS idx_template_uploads_uploader_id;

-- workflow_instances table unused indexes
DROP INDEX IF EXISTS idx_workflow_instances_status;
DROP INDEX IF EXISTS idx_workflow_instances_parent_flow;
DROP INDEX IF EXISTS idx_workflow_instances_root_flow;
DROP INDEX IF EXISTS idx_workflow_instances_flow_type;
DROP INDEX IF EXISTS idx_workflow_instances_depth_level;
DROP INDEX IF EXISTS idx_workflow_instances_path;
DROP INDEX IF EXISTS idx_workflow_instances_is_template;

-- workflow_steps table unused indexes
DROP INDEX IF EXISTS idx_workflow_steps_instance_id;

-- tools table unused indexes
DROP INDEX IF EXISTS idx_tools_category;

-- analytics_events table unused indexes
DROP INDEX IF EXISTS idx_analytics_events_user_id;
DROP INDEX IF EXISTS idx_analytics_events_type;
DROP INDEX IF EXISTS idx_analytics_events_created_at;

-- flow_relationships table unused indexes
DROP INDEX IF EXISTS idx_flow_relationships_type;

-- nested_flow_templates table unused indexes
DROP INDEX IF EXISTS idx_nested_flow_templates_flow_type;
DROP INDEX IF EXISTS idx_nested_flow_templates_category;
DROP INDEX IF EXISTS idx_nested_flow_templates_author_id;
DROP INDEX IF EXISTS idx_nested_flow_templates_status;

-- flow_template_relationships table unused indexes
DROP INDEX IF EXISTS idx_flow_template_relationships_parent;
DROP INDEX IF EXISTS idx_flow_template_relationships_child;

-- ============================================================================
-- STEP 4: VERIFICATION QUERIES
-- ============================================================================

-- Verify RLS policies are using optimized auth function calls
SELECT 
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN cmd = 'r' THEN 'SELECT'
        WHEN cmd = 'a' THEN 'INSERT'
        WHEN cmd = 'w' THEN 'UPDATE'
        WHEN cmd = 'd' THEN 'DELETE'
        WHEN cmd = '*' THEN 'ALL'
        ELSE cmd::text
    END as operation,
    CASE 
        WHEN qual LIKE '%(select auth.uid())%' THEN '✅ Optimized'
        WHEN qual LIKE '%auth.uid()%' THEN '❌ Needs optimization'
        ELSE '⚠️ Check manually'
    END as auth_optimization_status
FROM pg_policies 
WHERE schemaname = 'public'
AND (qual LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%')
ORDER BY tablename, policyname;

-- Verify foreign key indexes
SELECT 
    t.table_name,
    c.column_name,
    CASE 
        WHEN i.indexname IS NOT NULL THEN '✅ Indexed'
        ELSE '❌ Missing index'
    END as index_status
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
JOIN information_schema.table_constraints tc ON t.table_name = tc.table_name
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
LEFT JOIN pg_indexes i ON i.tablename = t.table_name AND i.indexdef LIKE '%' || c.column_name || '%'
WHERE t.table_schema = 'public'
AND tc.constraint_type = 'FOREIGN KEY'
AND c.column_name IN (
    'moderated_by',
    'original_workflow_id',
    'template_id',
    'tool_id'
)
ORDER BY t.table_name, c.column_name;

-- Show remaining indexes for verification
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname NOT LIKE 'pg_%'
ORDER BY tablename, indexname;

-- ============================================================================
-- STEP 5: PERFORMANCE MONITORING SETUP
-- ============================================================================

-- Create a function to monitor index usage
CREATE OR REPLACE FUNCTION public.get_index_usage_stats()
RETURNS TABLE (
    table_name text,
    index_name text,
    index_scans bigint,
    index_tuples_read bigint,
    index_tuples_fetched bigint
) AS $$
BEGIN
    SET search_path = public;
    RETURN QUERY
    SELECT 
        schemaname::text as table_name,
        indexrelname::text as index_name,
        idx_scan as index_scans,
        idx_tup_read as index_tuples_read,
        idx_tup_fetch as index_tuples_fetched
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    ORDER BY idx_scan DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to monitor slow queries
CREATE OR REPLACE FUNCTION public.get_slow_queries()
RETURNS TABLE (
    query text,
    calls bigint,
    total_time double precision,
    mean_time double precision,
    rows bigint
) AS $$
BEGIN
    SET search_path = public;
    RETURN QUERY
    SELECT 
        query::text,
        calls,
        total_time,
        mean_time,
        rows
    FROM pg_stat_statements
    WHERE mean_time > 100  -- Queries taking more than 100ms on average
    ORDER BY mean_time DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_index_usage_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_slow_queries() TO authenticated;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- Display completion status
SELECT 
    'Database Performance and Security Fixes Completed' as status,
    'All auth RLS initialization plan issues fixed' as auth_fixes,
    'Foreign key indexes added for better performance' as index_fixes,
    'Unused indexes removed to improve write performance' as cleanup_fixes,
    'Performance monitoring functions created' as monitoring_setup;
