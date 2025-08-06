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
    current_parent_id UUID;
    current_depth INTEGER;
BEGIN
    -- Get the current flow's parent and depth
    SELECT parent_flow_id, depth_level INTO current_parent_id, current_depth
    FROM workflow_instances
    WHERE id = flow_id;
    
    -- If no parent, return empty
    IF current_parent_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Return the immediate parent
    RETURN QUERY
    SELECT 
        wi.id as ancestor_id,
        wi.name as ancestor_name,
        wi.flow_type as ancestor_type,
        wi.depth_level,
        wi.path
    FROM workflow_instances wi
    WHERE wi.id = current_parent_id;
    
    -- For now, just return the immediate parent
    -- We can expand this later if needed
END;
$$ LANGUAGE plpgsql; 