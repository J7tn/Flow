# Database Performance and Security Fixes Guide

## Overview

This guide addresses all the Supabase database linting issues identified in your Flow application. The fixes are designed to improve query performance, enhance security, and optimize database operations.

## Issues Addressed

### 1. Auth RLS Initialization Plan (Performance Issue)
**Problem**: RLS policies were re-evaluating `auth.uid()` for each row, causing suboptimal query performance.

**Solution**: Wrapped all `auth.uid()` calls in `(select auth.uid())` to ensure they're evaluated once per query instead of once per row.

**Tables Fixed**:
- `user_profiles`
- `workflow_templates` (using correct `template_status` enum: 'draft', 'pending', 'approved', 'rejected')
- `workflow_instances`
- `template_reviews`
- `nested_flow_templates` (using correct `template_status` enum: 'draft', 'pending', 'approved', 'rejected')
- `template_uploads`
- `user_favorites`

### 2. Function Search Path Mutable (Security Issue)
**Problem**: Functions without explicit search paths can be vulnerable to search path manipulation attacks.

**Solution**: Added `SET search_path = public;` to all functions to ensure they use a fixed, secure search path.

**Functions Fixed**:
- `get_index_usage_stats()` - Performance monitoring function
- `get_slow_queries()` - Performance monitoring function
- All existing functions in `fix-function-security-complete.sql`

### 3. Unindexed Foreign Keys (Performance Issue)
**Problem**: Foreign key columns without indexes can cause slow joins and constraint checks.

**Solution**: Added indexes for all unindexed foreign key columns.

**Indexes Added**:
- `idx_nested_flow_templates_moderated_by`
- `idx_template_reviews_moderated_by`
- `idx_template_uploads_original_workflow_id`
- `idx_user_favorites_template_id`
- `idx_user_favorites_tool_id`
- `idx_workflow_instances_template_id`
- `idx_workflow_templates_moderated_by`

### 4. Unused Indexes (Performance Issue)
**Problem**: Unused indexes consume storage space and slow down write operations.

**Solution**: Removed 30+ unused indexes to improve write performance and reduce storage overhead.

**Indexes Removed**:
- Multiple indexes on `workflow_templates` (category, difficulty, rating, etc.)
- Unused indexes on `template_reviews`, `review_votes`, `template_uploads`
- Unused indexes on `workflow_instances`, `workflow_steps`, `tools`
- Unused indexes on `analytics_events`, `flow_relationships`
- Unused indexes on `nested_flow_templates`, `flow_template_relationships`

## How to Apply the Fixes

### Option 1: Run the Complete Script (Recommended)

1. **Backup your database** (if possible)
2. **Run the database performance script** in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of database-performance-fixes.sql
   ```
3. **Run the auth security script** (optional, for additional security):
   ```sql
   -- Copy and paste the contents of auth-security-fixes.sql
   ```
4. **Configure auth settings manually** in Supabase Dashboard (required for auth warnings):
   - Go to Authentication > Settings
   - Set OTP Expiry to 3600 seconds (1 hour) or less
   - Enable Leaked Password Protection

### Option 2: Apply Fixes Incrementally

If you prefer to apply fixes step by step:

#### Step 1: Fix Auth RLS Issues
```sql
-- Run the RLS policy fixes section only
-- This addresses the "auth_rls_initplan" warnings
```

#### Step 2: Add Missing Indexes
```sql
-- Run the foreign key index creation section
-- This addresses the "unindexed_foreign_keys" warnings
```

#### Step 3: Remove Unused Indexes
```sql
-- Run the unused index removal section
-- This addresses the "unused_index" warnings
```

## Verification

After applying the fixes, you can verify the changes using the verification queries included in the script:

### 1. Check RLS Policy Optimization
```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN qual LIKE '%(select auth.uid())%' THEN '✅ Optimized'
        WHEN qual LIKE '%auth.uid()%' THEN '❌ Needs optimization'
        ELSE '⚠️ Check manually'
    END as auth_optimization_status
FROM pg_policies 
WHERE schemaname = 'public'
AND (qual LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%')
ORDER BY tablename, policyname;
```

### 2. Verify Foreign Key Indexes
```sql
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
```

## Performance Monitoring

The script includes two monitoring functions:

### 1. Index Usage Statistics
```sql
SELECT * FROM public.get_index_usage_stats();
```
This shows which indexes are being used and how frequently.

### 2. Slow Query Analysis
```sql
SELECT * FROM public.get_slow_queries();
```
This identifies queries taking more than 100ms on average.

## Expected Performance Improvements

### Query Performance
- **RLS Policy Optimization**: 20-50% improvement in query performance for tables with RLS policies
- **Foreign Key Indexes**: Faster joins and constraint checks
- **Unused Index Removal**: Improved write performance (INSERT/UPDATE/DELETE operations)

### Storage Optimization
- **Index Cleanup**: Reduced storage overhead from unused indexes
- **Better Index Utilization**: More efficient use of available indexes

### Security
- **Maintained Security**: All RLS policies remain functionally identical
- **Performance Enhancement**: Security checks are now more efficient

## Rollback Plan

If you need to rollback any changes:

### Restore RLS Policies
```sql
-- Recreate original RLS policies (if you have backups)
-- The original policies can be restored by removing the (select ...) wrapper
```

### Restore Indexes
```sql
-- Recreate any removed indexes if needed
-- Use the original index creation statements
```

## Best Practices Going Forward

### 1. Monitor Index Usage
Regularly check index usage to identify unused indexes:
```sql
SELECT * FROM public.get_index_usage_stats() WHERE index_scans = 0;
```

### 2. Optimize New RLS Policies
Always use `(select auth.uid())` instead of `auth.uid()` in RLS policies:
```sql
-- ✅ Good
CREATE POLICY "example" ON table_name FOR SELECT USING ((select auth.uid()) = user_id);

-- ❌ Avoid
CREATE POLICY "example" ON table_name FOR SELECT USING (auth.uid() = user_id);
```

### 3. Index New Foreign Keys
Always create indexes for new foreign key columns:
```sql
CREATE INDEX idx_table_name_foreign_key_column ON table_name(foreign_key_column);
```

### 4. Regular Performance Reviews
- Monitor slow queries monthly
- Review index usage quarterly
- Update RLS policies when adding new tables

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure you have the necessary permissions to modify RLS policies and indexes
2. **Lock Conflicts**: Run the script during low-traffic periods
3. **Policy Conflicts**: Check for conflicting RLS policies before applying changes

### Support

If you encounter issues:
1. Check the Supabase logs for error messages
2. Verify the current state using the verification queries
3. Consider rolling back changes if necessary

## Conclusion

These fixes will significantly improve your database performance while maintaining security. The changes are backward-compatible and follow Supabase best practices. Monitor the performance improvements and continue to optimize based on usage patterns.
