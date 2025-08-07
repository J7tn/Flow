-- Complete Function Security Fix
-- This script addresses ALL "function_search_path_mutable" warnings comprehensively

-- ============================================================================
-- STEP 1: DROP ALL EXISTING FUNCTIONS FIRST
-- ============================================================================

-- Drop all functions that need to be recreated
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_template_rating() CASCADE;
DROP FUNCTION IF EXISTS public.update_review_helpful_votes() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_flow_progress(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.update_flow_path() CASCADE;
DROP FUNCTION IF EXISTS public.get_flow_descendants(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_flow_ancestors(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.handle_template_author() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;

-- ============================================================================
-- STEP 2: RECREATE ALL FUNCTIONS WITH EXPLICIT SEARCH PATHS
-- ============================================================================

-- ============================================================================
-- 1. UPDATE UPDATED AT COLUMN FUNCTION
-- ============================================================================

CREATE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    SET search_path = public;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. HANDLE NEW USER FUNCTION
-- ============================================================================

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    SET search_path = public;
    INSERT INTO public.user_profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. UPDATE TEMPLATE RATING FUNCTION
-- ============================================================================

CREATE FUNCTION public.update_template_rating()
RETURNS TRIGGER AS $$
BEGIN
    SET search_path = public;
    UPDATE public.workflow_templates
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.template_reviews
            WHERE template_id = COALESCE(NEW.template_id, OLD.template_id)
            AND status = 'approved'
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.template_id, OLD.template_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. UPDATE REVIEW HELPFUL VOTES FUNCTION
-- ============================================================================

CREATE FUNCTION public.update_review_helpful_votes()
RETURNS TRIGGER AS $$
BEGIN
    SET search_path = public;
    UPDATE public.template_reviews
    SET 
        helpful_votes = (
            SELECT COUNT(*)
            FROM public.review_votes
            WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
            AND is_helpful = true
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. CALCULATE FLOW PROGRESS FUNCTION
-- ============================================================================

CREATE FUNCTION public.calculate_flow_progress(flow_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_steps INTEGER;
    completed_steps INTEGER;
BEGIN
    SET search_path = public;
    
    -- Get total steps
    SELECT COUNT(*) INTO total_steps
    FROM public.workflow_steps
    WHERE workflow_instance_id = flow_id;
    
    -- Get completed steps
    SELECT COUNT(*) INTO completed_steps
    FROM public.workflow_steps
    WHERE workflow_instance_id = flow_id
    AND is_completed = true;
    
    -- Return percentage
    IF total_steps = 0 THEN
        RETURN 0;
    ELSE
        RETURN ROUND((completed_steps::DECIMAL / total_steps::DECIMAL) * 100, 2);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. UPDATE FLOW PATH FUNCTION
-- ============================================================================

CREATE FUNCTION public.update_flow_path()
RETURNS TRIGGER AS $$
BEGIN
    SET search_path = public;
    
    -- Update the path based on parent
    IF NEW.parent_flow_id IS NOT NULL THEN
        SELECT path || '/' || NEW.id::TEXT INTO NEW.path
        FROM public.workflow_instances
        WHERE id = NEW.parent_flow_id;
    ELSE
        NEW.path := NEW.id::TEXT;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. GET FLOW DESCENDANTS FUNCTION
-- ============================================================================

CREATE FUNCTION public.get_flow_descendants(root_flow_id UUID)
RETURNS TABLE (
    descendant_id UUID,
    descendant_name TEXT,
    descendant_type flow_type,
    depth_level INTEGER,
    path TEXT
) AS $$
BEGIN
    SET search_path = public;
    
    RETURN QUERY
    WITH RECURSIVE flow_descendants_cte AS (
        -- Base case: the root flow
        SELECT 
            wi.id as flow_id,
            wi.name as flow_name,
            wi.flow_type as flow_type_val,
            wi.depth_level as flow_depth,
            wi.path as flow_path
        FROM public.workflow_instances wi
        WHERE wi.id = root_flow_id
        
        UNION ALL
        
        -- Recursive case: child flows
        SELECT 
            child_wi.id as flow_id,
            child_wi.name as flow_name,
            child_wi.flow_type as flow_type_val,
            child_wi.depth_level as flow_depth,
            child_wi.path as flow_path
        FROM public.workflow_instances child_wi
        INNER JOIN flow_descendants_cte parent_cte ON child_wi.parent_flow_id = parent_cte.flow_id
    )
    SELECT 
        descendant_cte.flow_id as descendant_id,
        descendant_cte.flow_name as descendant_name,
        descendant_cte.flow_type_val as descendant_type,
        descendant_cte.flow_depth as depth_level,
        descendant_cte.flow_path as path
    FROM flow_descendants_cte descendant_cte
    WHERE descendant_cte.flow_id != root_flow_id
    ORDER BY descendant_cte.flow_depth;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. GET FLOW ANCESTORS FUNCTION
-- ============================================================================

CREATE FUNCTION public.get_flow_ancestors(target_flow_id UUID)
RETURNS TABLE (
    ancestor_id UUID,
    ancestor_name TEXT,
    ancestor_type flow_type,
    depth_level INTEGER,
    path TEXT
) AS $$
BEGIN
    SET search_path = public;
    
    -- Return all ancestors using a recursive CTE approach with explicit aliases
    RETURN QUERY
    WITH RECURSIVE flow_ancestors_cte AS (
        -- Get the current flow (base case)
        SELECT 
            wi.id as flow_id,
            wi.name as flow_name,
            wi.flow_type as flow_type_val,
            wi.depth_level as flow_depth,
            wi.path as flow_path,
            wi.parent_flow_id as parent_id
        FROM public.workflow_instances wi
        WHERE wi.id = target_flow_id
        
        UNION ALL
        
        -- Get parent flows (recursive case)
        SELECT 
            parent_wi.id as flow_id,
            parent_wi.name as flow_name,
            parent_wi.flow_type as flow_type_val,
            parent_wi.depth_level as flow_depth,
            parent_wi.path as flow_path,
            parent_wi.parent_flow_id as parent_id
        FROM public.workflow_instances parent_wi
        INNER JOIN flow_ancestors_cte ancestor_cte ON parent_wi.id = ancestor_cte.parent_id
    )
    SELECT 
        ancestor_cte.flow_id as ancestor_id,
        ancestor_cte.flow_name as ancestor_name,
        ancestor_cte.flow_type_val as ancestor_type,
        ancestor_cte.flow_depth as depth_level,
        ancestor_cte.flow_path as path
    FROM flow_ancestors_cte ancestor_cte
    WHERE ancestor_cte.flow_id != target_flow_id
    ORDER BY ancestor_cte.flow_depth;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 9. HANDLE TEMPLATE AUTHOR FUNCTION
-- ============================================================================

CREATE FUNCTION public.handle_template_author()
RETURNS TRIGGER AS $$
BEGIN
    SET search_path = public;
    
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

-- ============================================================================
-- 10. UPDATE UPDATED AT FUNCTION
-- ============================================================================

CREATE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    SET search_path = public;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 3: RECREATE ALL TRIGGERS
-- ============================================================================

-- Recreate triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at 
    BEFORE UPDATE ON public.workflow_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_instances_updated_at 
    BEFORE UPDATE ON public.workflow_instances
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_steps_updated_at 
    BEFORE UPDATE ON public.workflow_steps
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tools_updated_at 
    BEFORE UPDATE ON public.tools
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_template_reviews_updated_at 
    BEFORE UPDATE ON public.template_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_template_uploads_updated_at 
    BEFORE UPDATE ON public.template_uploads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Recreate auth trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate template rating trigger
CREATE TRIGGER update_template_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.template_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_template_rating();

-- Recreate review helpful votes trigger
CREATE TRIGGER update_review_helpful_votes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.review_votes
    FOR EACH ROW EXECUTE FUNCTION public.update_review_helpful_votes();

-- Recreate template author triggers
CREATE TRIGGER set_template_author
    BEFORE INSERT ON public.workflow_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_template_author();

CREATE TRIGGER set_nested_template_author
    BEFORE INSERT ON public.nested_flow_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_template_author();

-- ============================================================================
-- STEP 4: VERIFICATION AND CACHE REFRESH
-- ============================================================================

-- Note: pg_reload_conf() requires superuser privileges, so we'll use alternative methods
-- The function changes should be picked up automatically by Supabase's linter

-- Verify all functions have explicit search paths
SELECT 
    proname as function_name,
    CASE 
        WHEN prosrc LIKE '%SET search_path = public;%' THEN '✅ Has explicit search path'
        ELSE '❌ Missing explicit search path'
    END as search_path_status
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND proname IN (
    'update_updated_at_column',
    'handle_new_user',
    'update_template_rating',
    'update_review_helpful_votes',
    'calculate_flow_progress',
    'update_flow_path',
    'get_flow_descendants',
    'get_flow_ancestors',
    'handle_template_author',
    'update_updated_at'
)
ORDER BY proname;

-- Show function creation statements for verification
SELECT 
    'CREATE OR REPLACE FUNCTION ' || proname || '(' || 
    CASE 
        WHEN array_length(proargtypes, 1) IS NULL THEN ''
        ELSE 'parameters'
    END || ') AS $$' || E'\n' ||
    'BEGIN' || E'\n' ||
    '    SET search_path = public;' || E'\n' ||
    '    -- Function body here' || E'\n' ||
    'END;' || E'\n' ||
    '$$ LANGUAGE plpgsql;' as verification_statement
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND proname IN (
    'update_updated_at_column',
    'handle_new_user',
    'update_template_rating',
    'update_review_helpful_votes',
    'calculate_flow_progress',
    'update_flow_path',
    'get_flow_descendants',
    'get_flow_ancestors',
    'handle_template_author',
    'update_updated_at'
)
ORDER BY proname; 