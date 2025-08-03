# Supabase Storage and Database Setup Guide

This guide will help you set up the necessary storage buckets and database policies for the Flow application.

## Quick Setup (Recommended)

Run this single SQL script in your Supabase SQL Editor to set up everything at once:

```sql
-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  1048576, -- 1MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the avatars bucket
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- Allow users to update avatars
CREATE POLICY "Users can update avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars');

-- Allow public read access to avatars
CREATE POLICY "Public read avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to delete avatars
CREATE POLICY "Users can delete avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars');

-- Enable RLS on user_profiles table if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles table
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON user_profiles
FOR DELETE USING (auth.uid() = id);
```

## Manual Setup

### 1. Storage Bucket Setup

#### Option A: Using SQL Editor

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run this SQL command:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  1048576, -- 1MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif']
) ON CONFLICT (id) DO NOTHING;
```

#### Option B: Using Storage UI

1. Go to your Supabase dashboard
2. Navigate to **Storage**
3. Click **Create a new bucket**
4. Set the following:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Checked
   - **File size limit**: `1048576` (1MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/gif`

### 2. Storage Policies Setup

#### Option A: Using SQL Editor

Run these commands one by one in the SQL Editor:

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- Allow users to update avatars
CREATE POLICY "Users can update avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars');

-- Allow public read access to avatars
CREATE POLICY "Public read avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to delete avatars
CREATE POLICY "Users can delete avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars');
```

#### Option B: Using Storage UI

1. Go to **Storage** → **avatars** bucket
2. Click on **Policies** tab
3. Click **New Policy**
4. Create 4 policies with these settings:

**Policy 1 - Upload:**
- **Policy name**: `Users can upload avatars`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: `bucket_id = 'avatars'`

**Policy 2 - Update:**
- **Policy name**: `Users can update avatars`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**: `bucket_id = 'avatars'`

**Policy 3 - Read:**
- **Policy name**: `Public read avatars`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: `bucket_id = 'avatars'`

**Policy 4 - Delete:**
- **Policy name**: `Users can delete avatars`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**: `bucket_id = 'avatars'`

### 3. User Profiles Table RLS Policies

#### Option A: Using SQL Editor

Run these commands in the SQL Editor:

```sql
-- Enable RLS on user_profiles table if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles table
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON user_profiles
FOR DELETE USING (auth.uid() = id);
```

#### Option B: Using Table Editor

1. Go to **Table Editor**
2. Select the **user_profiles** table
3. Go to **RLS** tab
4. Enable **Row Level Security**
5. Click **New Policy** and create 4 policies:

**Policy 1 - Read:**
- **Policy name**: `Users can read own profile`
- **Allowed operation**: `SELECT`
- **Target roles**: `authenticated`
- **Policy definition**: `auth.uid() = id`

**Policy 2 - Insert:**
- **Policy name**: `Users can insert own profile`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: `auth.uid() = id`

**Policy 3 - Update:**
- **Policy name**: `Users can update own profile`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**: `auth.uid() = id`

**Policy 4 - Delete:**
- **Policy name**: `Users can delete own profile`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **Policy definition**: `auth.uid() = id`

## Verification

After setup, verify everything is working:

1. **Check Storage Bucket:**
   - Go to **Storage** → You should see `avatars` bucket
   - Click on it → **Policies** tab should show 4 policies

2. **Check User Profiles Table:**
   - Go to **Table Editor** → **user_profiles**
   - **RLS** tab should show RLS enabled with 4 policies

3. **Test in Application:**
   - Try uploading an avatar
   - Try updating profile information
   - Both should work without errors

## Troubleshooting

### Common Issues:

1. **"Bucket not found" error:**
   - Make sure the bucket name is exactly `avatars`
   - Check that the bucket was created successfully

2. **"Avatar storage not configured" error:**
   - Verify all 4 storage policies are created
   - Check that policies have correct target roles and definitions

3. **"Profile update failed" error:**
   - Verify RLS is enabled on user_profiles table
   - Check that all 4 user_profiles policies are created
   - Ensure user is authenticated

4. **"Permission denied" errors:**
   - Check that policies use `auth.uid()` for user identification
   - Verify user is properly authenticated

### Policy Definitions Explained:

- **Storage policies**: Control access to files in the avatars bucket
- **RLS policies**: Control access to user profile data in the database
- **`auth.uid()`**: Gets the current authenticated user's ID
- **`bucket_id = 'avatars'`**: Restricts operations to the avatars bucket only

## Security Notes

- Users can only upload/update/delete their own avatars
- All avatars are publicly readable (needed for display)
- File names are automatically generated to prevent conflicts
- Users can only access their own profile data
- All operations require authentication 