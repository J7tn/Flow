-- Fix the get_flow_ancestors function
-- Run this in your Supabase SQL editor

CREATE OR REPLACE FUNCTION get_flow_ancestors(flow_id UUID)
RETURNS TABLE (
    ancestor_id UUID,
    ancestor_name TEXT,
    ancestor_type flow_type,
    depth_level INTEGER,
    path TEXT
) AS $$
DECLARE
    flow_path TEXT;
BEGIN
    -- Get the path of the current flow
    SELECT path INTO flow_path
    FROM workflow_instances
    WHERE id = flow_id;
    
    IF flow_path IS NULL THEN
        RETURN;
    END IF;
    
    -- Return all ancestors using a recursive CTE approach
    RETURN QUERY
    WITH RECURSIVE ancestors AS (
        -- Get the current flow
        SELECT 
            id,
            name,
            flow_type,
            depth_level,
            path,
            parent_flow_id
        FROM workflow_instances
        WHERE id = flow_id
        
        UNION ALL
        
        -- Get parent flows
        SELECT 
            wi.id,
            wi.name,
            wi.flow_type,
            wi.depth_level,
            wi.path,
            wi.parent_flow_id
        FROM workflow_instances wi
        INNER JOIN ancestors a ON wi.id = a.parent_flow_id
    )
    SELECT 
        a.id as ancestor_id,
        a.name as ancestor_name,
        a.flow_type as ancestor_type,
        a.depth_level,
        a.path
    FROM ancestors a
    WHERE a.id != flow_id
    ORDER BY a.depth_level;
END;
$$ LANGUAGE plpgsql; 