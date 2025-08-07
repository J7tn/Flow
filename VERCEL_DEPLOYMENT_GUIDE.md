# Vercel Deployment Fix Guide

## Problem
Your friend cannot use the app through the Vercel domain because the deployment is missing required environment variables.

## Solution

### Step 1: Add Environment Variables to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **flow-five-virid**
3. Go to **Settings** → **Environment Variables**
4. Add these environment variables:

```
VITE_SUPABASE_URL=https://xkelgvdcgtobgexigyol.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZWxndmRjZ3RvYmdleGlneW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTIxODQsImV4cCI6MjA2OTUyODE4NH0.KY3CYnOXAY3sYYRLXSLThuEzkw1yLmThwINjiYFRXeU
VITE_CHAT2API_URL=http://localhost:5005
VITE_CHAT2API_AUTHORIZATION=sk-flow-ai-key-2024
```

### Step 2: Redeploy

After adding the environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger automatic deployment

### Step 3: Test the Fix

Once deployed, test at: https://flow-five-virid.vercel.app/

Your friend should now be able to:
- ✅ Access the landing page
- ✅ Sign up/login (Supabase will work)
- ✅ Use core app features

## Chat2API Note

The Chat2API service is currently set to `localhost:5005`, which won't work in production. The app has been updated to handle this gracefully:

- **Development**: Chat2API works normally
- **Production**: Chat2API features will show a helpful error message instead of crashing

### To Enable Chat2API in Production (Optional)

1. Deploy your Chat2API service to a public URL (Railway, Render, Heroku, etc.)
2. Update `VITE_CHAT2API_URL` in Vercel environment variables to point to the public URL
3. Redeploy

## Environment Variables Explained

| Variable | Purpose | Required |
|----------|---------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key for client access | ✅ Yes |
| `VITE_CHAT2API_URL` | Chat2API service URL | ❌ No (optional) |
| `VITE_CHAT2API_AUTHORIZATION` | Chat2API authorization key | ❌ No (optional) |

## Troubleshooting

If the app still doesn't work after adding environment variables:

1. **Check Vercel logs**: Go to your deployment and check the Function Logs
2. **Verify environment variables**: Make sure they're set for Production environment
3. **Clear browser cache**: Your friend should clear their browser cache
4. **Check Supabase**: Ensure your Supabase project is active and accessible

## Quick Test

You can test if the environment variables are working by checking the browser console at https://flow-five-virid.vercel.app/ - you should see Supabase configuration logs. 