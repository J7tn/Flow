-- Apply the fix for get_flow_ancestors function
-- Run this in your Supabase SQL editor

-- Drop the existing function first to ensure clean replacement
DROP FUNCTION IF EXISTS get_flow_ancestors(UUID);

-- Create the fixed function with explicit aliases to avoid all naming conflicts
CREATE OR REPLACE FUNCTION get_flow_ancestors(target_flow_id UUID)
RETURNS TABLE (
    ancestor_id UUID,
    ancestor_name TEXT,
    ancestor_type flow_type,
    depth_level INTEGER,
    path TEXT
) AS $$
BEGIN
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
        FROM workflow_instances wi
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
        FROM workflow_instances parent_wi
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