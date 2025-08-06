-- Nested Flows Database Schema Modifications
-- This file contains the changes needed to support hierarchical/nested flows
-- Safe version that checks for existing objects before creating them

-- Add new enum for flow types (only if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE flow_type AS ENUM ('goal', 'project', 'task', 'subtask');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new enum for flow relationships (only if it doesn't exist)
DO $$ BEGIN
    CREATE TYPE flow_relationship AS ENUM ('parent', 'child', 'sibling', 'dependency');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Modify workflow_instances table to support hierarchy (only add columns that don't exist)
DO $$ 
BEGIN
    -- Add flow_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_instances' AND column_name = 'flow_type') THEN
        ALTER TABLE public.workflow_instances ADD COLUMN flow_type flow_type DEFAULT 'project';
    END IF;
    
    -- Add parent_flow_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_instances' AND column_name = 'parent_flow_id') THEN
        ALTER TABLE public.workflow_instances ADD COLUMN parent_flow_id UUID REFERENCES public.workflow_instances(id) ON DELETE CASCADE;
    END IF;
    
    -- Add root_flow_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_instances' AND column_name = 'root_flow_id') THEN
        ALTER TABLE public.workflow_instances ADD COLUMN root_flow_id UUID REFERENCES public.workflow_instances(id) ON DELETE CASCADE;
    END IF;
    
    -- Add depth_level column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_instances' AND column_name = 'depth_level') THEN
        ALTER TABLE public.workflow_instances ADD COLUMN depth_level INTEGER DEFAULT 0;
    END IF;
    
    -- Add path column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_instances' AND column_name = 'path') THEN
        ALTER TABLE public.workflow_instances ADD COLUMN path TEXT DEFAULT '';
    END IF;
    
    -- Add is_template column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_instances' AND column_name = 'is_template') THEN
        ALTER TABLE public.workflow_instances ADD COLUMN is_template BOOLEAN DEFAULT false;
    END IF;
    
    -- Add template_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workflow_instances' AND column_name = 'template_id') THEN
        ALTER TABLE public.workflow_instances ADD COLUMN template_id UUID REFERENCES public.workflow_templates(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create a new table for flow relationships (for complex hierarchies)
CREATE TABLE IF NOT EXISTS public.flow_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_flow_id UUID REFERENCES public.workflow_instances(id) ON DELETE CASCADE NOT NULL,
  child_flow_id UUID REFERENCES public.workflow_instances(id) ON DELETE CASCADE NOT NULL,
  relationship_type flow_relationship NOT NULL DEFAULT 'parent',
  order_index INTEGER DEFAULT 0,
  dependency_type TEXT DEFAULT 'finish_to_start',
  lag_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_flow_id, child_flow_id)
);

-- Create a new table for flow templates that can be nested
CREATE TABLE IF NOT EXISTS public.nested_flow_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  flow_type flow_type NOT NULL,
  category template_category,
  difficulty difficulty_level DEFAULT 'intermediate',
  estimated_duration_min INTEGER,
  estimated_duration_max INTEGER,
  duration_unit TEXT DEFAULT 'weeks',
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  version TEXT DEFAULT '1.0.0',
  author_id UUID REFERENCES public.user_profiles(id),
  author_name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  steps JSONB NOT NULL DEFAULT '[]',
  sub_flows JSONB NOT NULL DEFAULT '[]', -- References to other templates that can be nested
  cost_analysis JSONB NOT NULL DEFAULT '{}',
  recommended_tools JSONB NOT NULL DEFAULT '[]',
  optimization_suggestions JSONB NOT NULL DEFAULT '[]',
  industry_context JSONB NOT NULL DEFAULT '{}',
  success_metrics JSONB NOT NULL DEFAULT '[]',
  risks JSONB NOT NULL DEFAULT '[]',
  customization_options JSONB NOT NULL DEFAULT '[]',
  status template_status DEFAULT 'pending',
  moderation_notes TEXT,
  moderated_by UUID REFERENCES public.user_profiles(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for flow template relationships
CREATE TABLE IF NOT EXISTS public.flow_template_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_template_id UUID REFERENCES public.nested_flow_templates(id) ON DELETE CASCADE NOT NULL,
  child_template_id UUID REFERENCES public.nested_flow_templates(id) ON DELETE CASCADE NOT NULL,
  relationship_type flow_relationship NOT NULL DEFAULT 'parent',
  order_index INTEGER DEFAULT 0,
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_template_id, child_template_id)
);

-- Add indexes for better performance (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workflow_instances_parent_flow') THEN
        CREATE INDEX idx_workflow_instances_parent_flow ON public.workflow_instances(parent_flow_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workflow_instances_root_flow') THEN
        CREATE INDEX idx_workflow_instances_root_flow ON public.workflow_instances(root_flow_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workflow_instances_flow_type') THEN
        CREATE INDEX idx_workflow_instances_flow_type ON public.workflow_instances(flow_type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workflow_instances_depth_level') THEN
        CREATE INDEX idx_workflow_instances_depth_level ON public.workflow_instances(depth_level);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workflow_instances_path') THEN
        CREATE INDEX idx_workflow_instances_path ON public.workflow_instances(path);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_workflow_instances_is_template') THEN
        CREATE INDEX idx_workflow_instances_is_template ON public.workflow_instances(is_template);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_flow_relationships_parent') THEN
        CREATE INDEX idx_flow_relationships_parent ON public.flow_relationships(parent_flow_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_flow_relationships_child') THEN
        CREATE INDEX idx_flow_relationships_child ON public.flow_relationships(child_flow_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_flow_relationships_type') THEN
        CREATE INDEX idx_flow_relationships_type ON public.flow_relationships(relationship_type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_nested_flow_templates_flow_type') THEN
        CREATE INDEX idx_nested_flow_templates_flow_type ON public.nested_flow_templates(flow_type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_nested_flow_templates_category') THEN
        CREATE INDEX idx_nested_flow_templates_category ON public.nested_flow_templates(category);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_nested_flow_templates_author_id') THEN
        CREATE INDEX idx_nested_flow_templates_author_id ON public.nested_flow_templates(author_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_nested_flow_templates_status') THEN
        CREATE INDEX idx_nested_flow_templates_status ON public.nested_flow_templates(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_flow_template_relationships_parent') THEN
        CREATE INDEX idx_flow_template_relationships_parent ON public.flow_template_relationships(parent_template_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_flow_template_relationships_child') THEN
        CREATE INDEX idx_flow_template_relationships_child ON public.flow_template_relationships(child_template_id);
    END IF;
END $$;

-- Create triggers (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_flow_relationships_updated_at') THEN
        CREATE TRIGGER update_flow_relationships_updated_at BEFORE UPDATE ON public.flow_relationships
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_nested_flow_templates_updated_at') THEN
        CREATE TRIGGER update_nested_flow_templates_updated_at BEFORE UPDATE ON public.nested_flow_templates
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_flow_template_relationships_updated_at') THEN
        CREATE TRIGGER update_flow_template_relationships_updated_at BEFORE UPDATE ON public.flow_template_relationships
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create or replace functions
CREATE OR REPLACE FUNCTION update_flow_path()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the path based on parent flow
    IF NEW.parent_flow_id IS NOT NULL THEN
        SELECT path || '/' || id::text INTO NEW.path
        FROM workflow_instances
        WHERE id = NEW.parent_flow_id;
        
        -- Update depth level
        NEW.depth_level = array_length(string_to_array(NEW.path, '/'), 1) - 1;
        
        -- Update root flow id
        IF NEW.root_flow_id IS NULL THEN
            SELECT COALESCE(root_flow_id, id) INTO NEW.root_flow_id
            FROM workflow_instances
            WHERE id = NEW.parent_flow_id;
        END IF;
    ELSE
        -- Root flow
        NEW.path = '/' || NEW.id::text;
        NEW.depth_level = 0;
        NEW.root_flow_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for flow path updates (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_flow_path_trigger') THEN
        CREATE TRIGGER update_flow_path_trigger
          BEFORE INSERT OR UPDATE ON public.workflow_instances
          FOR EACH ROW EXECUTE FUNCTION update_flow_path();
    END IF;
END $$;

-- Function to get all descendants of a flow
CREATE OR REPLACE FUNCTION get_flow_descendants(flow_id UUID)
RETURNS TABLE (
    descendant_id UUID,
    descendant_name TEXT,
    descendant_type flow_type,
    depth_level INTEGER,
    path TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wi.id,
        wi.name,
        wi.flow_type,
        wi.depth_level,
        wi.path
    FROM workflow_instances wi
    WHERE wi.path LIKE '%/' || flow_id::text || '/%'
       OR wi.path LIKE '%/' || flow_id::text
    ORDER BY wi.path;
END;
$$ LANGUAGE plpgsql;

-- Function to get all ancestors of a flow
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
        id as ancestor_id,
        name as ancestor_name,
        flow_type as ancestor_type,
        depth_level,
        path
    FROM ancestors
    WHERE id != flow_id
    ORDER BY depth_level;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate progress including descendants
CREATE OR REPLACE FUNCTION calculate_flow_progress(flow_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_flows INTEGER;
    completed_flows INTEGER;
    progress DECIMAL;
BEGIN
    -- Count total flows (including the current one and all descendants)
    SELECT COUNT(*) INTO total_flows
    FROM workflow_instances
    WHERE id = flow_id 
       OR path LIKE '%/' || flow_id::text || '/%'
       OR path LIKE '%/' || flow_id::text;
    
    -- Count completed flows
    SELECT COUNT(*) INTO completed_flows
    FROM workflow_instances
    WHERE (id = flow_id OR path LIKE '%/' || flow_id::text || '/%' OR path LIKE '%/' || flow_id::text)
      AND status = 'completed';
    
    -- Calculate progress
    IF total_flows > 0 THEN
        progress := (completed_flows::DECIMAL / total_flows::DECIMAL) * 100;
    ELSE
        progress := 0;
    END IF;
    
    RETURN ROUND(progress, 2);
END;
$$ LANGUAGE plpgsql; 