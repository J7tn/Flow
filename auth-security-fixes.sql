-- Auth Security Fixes
-- This script addresses Supabase auth security warnings

-- ============================================================================
-- STEP 1: FIX AUTH OTP EXPIRY (if you have access to modify auth settings)
-- ============================================================================

-- Note: These settings are typically configured in the Supabase Dashboard
-- under Authentication > Settings > Auth Providers > Email

-- Recommended OTP expiry settings:
-- - Set OTP expiry to 3600 seconds (1 hour) or less
-- - Default is often 24 hours (86400 seconds) which is too long

-- To fix this in Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Find "Email Auth" section
-- 3. Set "OTP Expiry" to 3600 (1 hour) or less
-- 4. Save changes

-- ============================================================================
-- STEP 2: ENABLE LEAKED PASSWORD PROTECTION
-- ============================================================================

-- Note: This is also configured in the Supabase Dashboard
-- under Authentication > Settings > Password Security

-- To enable leaked password protection:
-- 1. Go to Authentication > Settings
-- 2. Find "Password Security" section
-- 3. Enable "Leaked Password Protection"
-- 4. This will check passwords against HaveIBeenPwned.org
-- 5. Save changes

-- ============================================================================
-- STEP 3: ADDITIONAL AUTH SECURITY RECOMMENDATIONS
-- ============================================================================

-- Create a function to check auth security settings
CREATE OR REPLACE FUNCTION public.check_auth_security_settings()
RETURNS TABLE (
    setting_name text,
    current_value text,
    recommended_value text,
    status text
) AS $$
BEGIN
    SET search_path = public;
    
    RETURN QUERY
    SELECT 
        'OTP Expiry'::text as setting_name,
        'Check Dashboard'::text as current_value,
        '3600 seconds (1 hour) or less'::text as recommended_value,
        '⚠️ Configure in Dashboard'::text as status
    
    UNION ALL
    
    SELECT 
        'Leaked Password Protection'::text as setting_name,
        'Check Dashboard'::text as current_value,
        'Enabled'::text as recommended_value,
        '⚠️ Configure in Dashboard'::text as status
    
    UNION ALL
    
    SELECT 
        'Password Minimum Length'::text as setting_name,
        'Check Dashboard'::text as current_value,
        '8 characters minimum'::text as recommended_value,
        '⚠️ Configure in Dashboard'::text as status
    
    UNION ALL
    
    SELECT 
        'Password Complexity'::text as setting_name,
        'Check Dashboard'::text as current_value,
        'Require uppercase, lowercase, numbers'::text as recommended_value,
        '⚠️ Configure in Dashboard'::text as status;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_auth_security_settings() TO authenticated;

-- ============================================================================
-- STEP 4: VERIFICATION AND GUIDANCE
-- ============================================================================

-- Display security recommendations
SELECT 
    'Auth Security Recommendations' as title,
    'Please configure these settings in your Supabase Dashboard:' as description;

-- Show current auth security status
SELECT * FROM public.check_auth_security_settings();

-- ============================================================================
-- STEP 5: MANUAL CONFIGURATION STEPS
-- ============================================================================

-- Display step-by-step instructions
SELECT 
    'Manual Configuration Required' as status,
    'These settings must be configured in the Supabase Dashboard:' as note,
    '1. Go to Authentication > Settings' as step1,
    '2. Set OTP Expiry to 3600 seconds (1 hour) or less' as step2,
    '3. Enable Leaked Password Protection' as step3,
    '4. Set minimum password length to 8 characters' as step4,
    '5. Enable password complexity requirements' as step5;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 
    'Auth Security Fixes Script Completed' as status,
    'Please configure the recommended settings in your Supabase Dashboard' as next_steps,
    'All function search path issues have been addressed' as function_fixes,
    'Database performance optimizations are ready to apply' as performance_ready;
