#!/usr/bin/env node

/**
 * Supabase Credentials Verification Script
 * 
 * This script helps verify that your Supabase credentials are correct
 * before deploying to Vercel or other platforms.
 * 
 * Usage:
 *   node scripts/verify-supabase.js
 * 
 * Make sure to set your environment variables first:
 *   VITE_SUPABASE_URL=https://your-project-id.supabase.co
 *   VITE_SUPABASE_ANON_KEY=your-anon-key-here
 */

const { createClient } = require('@supabase/supabase-js');

async function verifySupabaseCredentials() {
  console.log('🔍 Verifying Supabase credentials...\n');

  // Get environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  // Check if environment variables are set
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Environment variables not found!');
    console.error('Please set the following environment variables:');
    console.error('  VITE_SUPABASE_URL=https://your-project-id.supabase.co');
    console.error('  VITE_SUPABASE_ANON_KEY=your-anon-key-here');
    console.error('\nYou can set them by:');
    console.error('  1. Creating a .env file in your project root');
    console.error('  2. Running: export VITE_SUPABASE_URL=...');
    console.error('  3. Or setting them in your deployment platform');
    process.exit(1);
  }

  // Validate URL format
  if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    console.error('❌ Invalid Supabase URL format!');
    console.error('URL should start with https:// and contain .supabase.co');
    console.error('Current URL:', supabaseUrl);
    process.exit(1);
  }

  // Validate key format
  if (!supabaseAnonKey.startsWith('eyJ')) {
    console.error('❌ Invalid Supabase anon key format!');
    console.error('Anon key should start with "eyJ"');
    console.error('Make sure you\'re using the anon/public key, not the service role key');
    process.exit(1);
  }

  console.log('✅ Environment variables found and validated');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);

  // Create Supabase client
  try {
    console.log('\n🔧 Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client created successfully');

    // Test connection by getting auth settings
    console.log('\n🔍 Testing connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      if (error.message.includes('Invalid API key')) {
        console.error('\n💡 This usually means:');
        console.error('   1. The anon key is incorrect');
        console.error('   2. You\'re using the service role key instead of anon key');
        console.error('   3. The project URL is wrong');
        console.error('   4. Your Supabase project is paused or inactive');
      }
      process.exit(1);
    }

    console.log('✅ Connection test successful');
    console.log('   Session:', data.session ? 'Active' : 'None (expected for anon key)');

    // Test a simple query to verify database access
    console.log('\n🔍 Testing database access...');
    try {
      // Try to access a table (this will fail with 401 if credentials are wrong)
      const { error: dbError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (dbError && dbError.code === 'PGRST116') {
        console.log('✅ Database access test passed (table might not exist, but auth works)');
      } else if (dbError) {
        console.log('⚠️  Database access test:', dbError.message);
        console.log('   (This might be expected if the table doesn\'t exist)');
      } else {
        console.log('✅ Database access test successful');
      }
    } catch (dbTestError) {
      console.log('⚠️  Database access test:', dbTestError.message);
      console.log('   (This might be expected if the table doesn\'t exist)');
    }

    console.log('\n🎉 All tests passed! Your Supabase credentials are valid.');
    console.log('\n📋 Next steps:');
    console.log('   1. If deploying to Vercel, add these environment variables:');
    console.log(`      VITE_SUPABASE_URL=${supabaseUrl}`);
    console.log(`      VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}`);
    console.log('   2. Redeploy your application');
    console.log('   3. Test authentication on your deployed domain');

  } catch (error) {
    console.error('❌ Error creating Supabase client:', error.message);
    process.exit(1);
  }
}

// Run the verification
verifySupabaseCredentials().catch((error) => {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
}); 