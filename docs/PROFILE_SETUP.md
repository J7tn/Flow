# Profile Management Setup Guide

This guide explains how to set up the user profile management functionality in the Flow application.

## Features

The profile management system allows users to:
- Edit their full name, company, and role
- Upload and change their profile picture (avatar)
- View their profile information in a clean, user-friendly interface

## Database Setup

The profile functionality uses the existing `user_profiles` table in the database. The table structure includes:

```sql
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Storage Setup

To enable avatar uploads, you need to create a Supabase Storage bucket:

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Storage in the left sidebar
3. Click "Create a new bucket"
4. Set the following:
   - **Name**: `avatars`
   - **Public bucket**: ✅ (checked)
   - **File size limit**: `1MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif`

### Option 2: Using SQL Script

Run the following SQL in your Supabase SQL Editor:

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
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to avatars
CREATE POLICY "Public read access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Components

### ProfileManager

The main component for profile management is located at `src/components/ProfileManager.tsx`. It provides:

- **Avatar upload**: Users can click "Change Avatar" to upload a new profile picture
- **Profile editing**: Users can edit their name, company, and role
- **Form validation**: Input validation using Zod schemas
- **Error handling**: Proper error messages and loading states
- **Responsive design**: Works well on all screen sizes

### Integration with Settings

The ProfileManager is integrated into the existing Settings component at `src/components/Settings.tsx` in the "Profile" tab.

## API Functions

The profile functionality uses the following API functions in `src/lib/api.ts`:

- `userApi.getProfile()`: Fetch user profile data
- `userApi.updateProfile(profileData)`: Update profile information
- `userApi.uploadAvatar(file)`: Upload a new avatar image

## Validation

Profile data is validated using Zod schemas in `src/lib/validation.ts`:

```typescript
export const userProfileSchema = z.object({
  full_name: nameSchema.optional(),
  email: emailSchema.optional(),
  avatar_url: z.string().url().optional(),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true),
  }).optional(),
});
```

## Security Features

- **File validation**: Only JPG, PNG, and GIF files up to 1MB are allowed
- **User isolation**: Users can only upload and manage their own avatars
- **Input sanitization**: All user inputs are validated and sanitized
- **Row-level security**: Database policies ensure users can only access their own data

## Usage

Users can access the profile management functionality by:

1. Logging into the application
2. Navigating to Settings (gear icon in the sidebar)
3. Clicking on the "Profile" tab
4. Using the "Edit Profile" button to make changes
5. Clicking "Change Avatar" to upload a new profile picture

## File Naming Convention

Avatar files are stored with the naming convention: `{user_id}-{timestamp}.{extension}`

This ensures:
- Unique filenames to prevent conflicts
- Easy identification of file ownership
- Proper security through RLS policies

## Troubleshooting

### Common Issues

1. **Avatar upload fails**: Check that the `avatars` storage bucket exists and has proper policies
2. **Profile not loading**: Verify the `user_profiles` table exists and has the correct structure
3. **Permission errors**: Ensure RLS policies are properly configured

### Debug Steps

1. Check browser console for error messages
2. Verify Supabase connection in the application
3. Test storage bucket access in Supabase Dashboard
4. Check database logs for any SQL errors

## Future Enhancements

Potential improvements to consider:

- Image cropping and resizing before upload
- Multiple avatar options (different sizes/styles)
- Profile completion percentage indicator
- Social media profile links
- Profile visibility settings
- Avatar generation from initials (fallback) 