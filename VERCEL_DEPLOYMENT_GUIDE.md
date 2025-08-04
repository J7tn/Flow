# Vercel Deployment Guide - Fixing 401 Authentication Errors

## Problem
You're getting 401 "invalid api key" errors when trying to sign in or sign up on your Vercel domain. This happens because the Supabase environment variables are not configured in your Vercel project.

## Solution

### Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (starts with `eyJ`)

### Step 2: Configure Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Flow project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Your Supabase anon/public key |
| `VITE_CHAT2API_URL` | `http://localhost:5005` | Chat2API URL (for local development) |
| `VITE_CHAT2API_AUTHORIZATION` | `sk-flow-ai-key-2024` | Chat2API authorization key |

### Step 3: Set Environment for Production

Make sure to set the environment to **Production** for all variables so they're available in your deployed app.

### Step 4: Redeploy Your Application

1. Go to the **Deployments** tab in Vercel
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger a new deployment

### Step 5: Verify the Configuration

After redeployment, you can verify the configuration:

1. Open your deployed app
2. Look for the **🔧 Config Debug** button in the bottom-right corner (in development mode)
3. Click it to see the configuration status
4. All Supabase variables should show as "Valid"

## Troubleshooting

### If you still get 401 errors:

1. **Check the environment variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify all variables are set correctly
   - Make sure they're set for **Production** environment

2. **Verify your Supabase credentials:**
   - Double-check the URL and anon key in your Supabase dashboard
   - Make sure you're copying the **anon/public** key, not the service role key

3. **Check your Supabase project settings:**
   - Go to Supabase Dashboard → Settings → API
   - Verify your project is active and not paused
   - Check if there are any rate limits or restrictions

4. **Test locally first:**
   - Create a `.env` file in your project root
   - Add your Supabase credentials
   - Run `npm run dev` and test authentication locally

### Common Issues:

1. **Wrong key type:** Make sure you're using the **anon/public** key, not the service role key
2. **Incorrect URL format:** The URL should start with `https://` and end with `.supabase.co`
3. **Environment not set:** Make sure environment variables are set for **Production** in Vercel
4. **Cached deployment:** Vercel might be serving a cached version - force a redeploy

## Local Development Setup

For local development, create a `.env` file in your project root:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Chat2API Configuration
VITE_CHAT2API_URL=http://localhost:5005
VITE_CHAT2API_AUTHORIZATION=sk-flow-ai-key-2024

# Optional Security Settings
VITE_ENABLE_HTTPS=true
VITE_ENABLE_CSP=true
VITE_ENABLE_HSTS=true

# Optional Rate Limiting
VITE_RATE_LIMIT_MAX_REQUESTS=100
VITE_RATE_LIMIT_WINDOW_MS=900000

# Optional Base Path (for deployment)
VITE_BASE_PATH=/
```

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in your `.gitignore`
- Use different Supabase projects for development and production
- Regularly rotate your API keys

## Next Steps

After fixing the environment variables:

1. Test authentication on your Vercel domain
2. Verify all features work correctly
3. Set up proper error monitoring
4. Consider setting up staging environment variables

## Support

If you continue to have issues:

1. Check the browser console for detailed error messages
2. Use the ConfigDebugger component to verify configuration
3. Check Vercel deployment logs for any build errors
4. Verify your Supabase project is active and properly configured 