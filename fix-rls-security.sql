-- Fix RLS Security for nested_flow_templates table
-- This script enables Row Level Security and creates appropriate policies

-- Enable RLS on nested_flow_templates table
ALTER TABLE public.nested_flow_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for nested_flow_templates table

-- Policy 1: Users can view public templates
CREATE POLICY "Users can view public templates" ON public.nested_flow_templates
    FOR SELECT
    USING (is_public = true OR auth.uid() = author_id);

-- Policy 2: Users can view their own templates (even if not public)
CREATE POLICY "Users can view their own templates" ON public.nested_flow_templates
    FOR SELECT
    USING (auth.uid() = author_id);

-- Policy 3: Users can create templates
CREATE POLICY "Users can create templates" ON public.nested_flow_templates
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Policy 4: Users can update their own templates
CREATE POLICY "Users can update their own templates" ON public.nested_flow_templates
    FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Policy 5: Users can delete their own templates
CREATE POLICY "Users can delete their own templates" ON public.nested_flow_templates
    FOR DELETE
    USING (auth.uid() = author_id);

-- Policy 6: Moderators can view all templates (for moderation purposes)
CREATE POLICY "Moderators can view all templates" ON public.nested_flow_templates
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() 
            AND role = 'moderator'
        )
    );

-- Policy 7: Moderators can update template status
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

-- Also enable RLS on related tables for consistency

-- Enable RLS on flow_template_relationships table
ALTER TABLE public.flow_template_relationships ENABLE ROW LEVEL SECURITY;

-- Policy for flow_template_relationships: Users can view relationships for templates they can access
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

-- Policy for flow_template_relationships: Users can create relationships for their own templates
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

-- Policy for flow_template_relationships: Users can update relationships for their own templates
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

-- Policy for flow_template_relationships: Users can delete relationships for their own templates
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

-- Create a function to automatically set author_id on insert
CREATE OR REPLACE FUNCTION public.handle_nested_flow_template_author()
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

-- Create trigger to automatically set author information
DROP TRIGGER IF EXISTS set_nested_flow_template_author ON public.nested_flow_templates;
CREATE TRIGGER set_nested_flow_template_author
    BEFORE INSERT ON public.nested_flow_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_nested_flow_template_author();

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_nested_flow_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_nested_flow_template_updated_at ON public.nested_flow_templates;
CREATE TRIGGER update_nested_flow_template_updated_at
    BEFORE UPDATE ON public.nested_flow_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_nested_flow_template_updated_at();

-- Create trigger for flow_template_relationships updated_at
DROP TRIGGER IF EXISTS update_flow_template_relationship_updated_at ON public.flow_template_relationships;
CREATE TRIGGER update_flow_template_relationship_updated_at
    BEFORE UPDATE ON public.flow_template_relationships
    FOR EACH ROW
    EXECUTE FUNCTION public.update_nested_flow_template_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.nested_flow_templates IS 'Templates for nested flows with RLS enabled for security';
COMMENT ON TABLE public.flow_template_relationships IS 'Relationships between flow templates with RLS enabled for security';
COMMENT ON POLICY "Users can view public templates" ON public.nested_flow_templates IS 'Allows users to view public templates';
COMMENT ON POLICY "Users can view their own templates" ON public.nested_flow_templates IS 'Allows users to view their own templates regardless of public status';
COMMENT ON POLICY "Users can create templates" ON public.nested_flow_templates IS 'Allows authenticated users to create templates';
COMMENT ON POLICY "Users can update their own templates" ON public.nested_flow_templates IS 'Allows users to update their own templates';
COMMENT ON POLICY "Users can delete their own templates" ON public.nested_flow_templates IS 'Allows users to delete their own templates';
COMMENT ON POLICY "Moderators can view all templates" ON public.nested_flow_templates IS 'Allows moderators to view all templates for moderation';
COMMENT ON POLICY "Moderators can update template status" ON public.nested_flow_templates IS 'Allows moderators to update template status for moderation';

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('nested_flow_templates', 'flow_template_relationships')
AND schemaname = 'public'; 