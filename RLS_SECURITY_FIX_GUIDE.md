# RLS Security Fix Guide

## Problem
You're getting a security warning: "Table public.nested_flow_templates is public, but RLS has not been enabled."

## What is RLS?
Row Level Security (RLS) is a PostgreSQL feature that restricts which rows users can access in a table. Without RLS enabled, all users can potentially access all data in the table, which is a security risk.

## Solution

### Option 1: Quick Fix (Just for nested_flow_templates)
Run the `fix-rls-security.sql` script in your Supabase SQL editor.

### Option 2: Comprehensive Fix (Recommended)
Run the `comprehensive-rls-security.sql` script to enable RLS on all tables.

## How to Apply the Fix

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Security Script**
   - Copy the contents of `comprehensive-rls-security.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify the Fix**
   - The script includes verification queries at the end
   - You should see all tables with `rowsecurity = true`

## What the Script Does

### Enables RLS on All Tables:
- `user_profiles`
- `workflow_templates`
- `workflow_instances`
- `workflow_steps`
- `tools`
- `user_favorites`
- `analytics_events`
- `template_reviews`
- `review_votes`
- `template_uploads`
- `flow_relationships`
- `nested_flow_templates`
- `flow_template_relationships`

### Creates Security Policies:
- **Users can only access their own data**
- **Public templates can be viewed by everyone**
- **Private templates are only visible to their authors**
- **Authenticated users can create content**
- **Users can only modify their own content**

### Adds Automatic Features:
- **Auto-set author_id** when creating templates
- **Auto-update timestamps** when modifying records
- **Proper error handling** for security violations

## Security Benefits

✅ **Data Isolation**: Users can only see their own data  
✅ **Template Privacy**: Private templates stay private  
✅ **Access Control**: Proper authentication required  
✅ **Audit Trail**: Automatic timestamp updates  
✅ **Compliance**: Meets security best practices  

## Testing the Fix

After applying the fix, test that:

1. **Users can still access their own data**
2. **Public templates are still visible**
3. **Private templates are properly restricted**
4. **New templates are created with correct author information**

## Troubleshooting

### If Users Can't Access Data:
- Check that users are properly authenticated
- Verify the user_id/author_id fields are set correctly
- Ensure the RLS policies are working as expected

### If Templates Aren't Visible:
- Check the `is_public` field on templates
- Verify the user has proper permissions
- Check the author_id matches the current user

### If You Get Policy Errors:
- The policies are working correctly - this means unauthorized access is being blocked
- Check your application logic to ensure proper authentication

## Rollback (If Needed)

If you need to disable RLS temporarily:

```sql
-- Disable RLS on a specific table
ALTER TABLE public.nested_flow_templates DISABLE ROW LEVEL SECURITY;

-- Drop all policies on a table
DROP POLICY IF EXISTS "Users can view public templates" ON public.nested_flow_templates;
-- (repeat for all policies)
```

## Next Steps

1. **Monitor the application** to ensure everything works correctly
2. **Test user permissions** thoroughly
3. **Review the security policies** to ensure they match your requirements
4. **Consider adding more granular permissions** if needed

## Security Best Practices

- **Never disable RLS** in production
- **Regularly review policies** for security gaps
- **Test with different user roles** to ensure proper access control
- **Monitor for policy violations** in your logs
- **Keep policies simple and auditable** 