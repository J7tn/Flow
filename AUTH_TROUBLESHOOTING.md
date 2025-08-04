# Authentication Troubleshooting Guide

## Current Issue: 401 "Invalid API Key" Error

Based on your logs, your Supabase configuration is working correctly:
- ✅ Supabase configuration validated successfully
- ✅ Supabase client created successfully

But you're still getting 401 errors when trying to authenticate.

## 🔍 **Diagnostic Steps**

### 1. Use the Auth Debugger
1. Open your app (local or deployed)
2. Look for the **🔐 Auth Debug** button in the bottom-left corner
3. Click it to open the authentication debugger
4. Click "Run Auth Tests" to see detailed error information

### 2. Check Your Supabase Project Settings

Go to your [Supabase Dashboard](https://supabase.com/dashboard) and verify:

#### Authentication Settings
1. Go to **Authentication** → **Settings**
2. Check if **Email confirmations** are enabled
3. Verify **Site URL** is set correctly (your Vercel domain)
4. Check **Redirect URLs** include your domain

#### API Settings
1. Go to **Settings** → **API**
2. Verify your **Project URL** and **anon key** match what's in Vercel
3. Check if your project is **active** (not paused)

### 3. Test User Creation

The 401 error might be because:
- The user doesn't exist yet
- Email confirmation is required
- Wrong credentials

**Try this:**
1. Use the Auth Debugger to test sign-up first
2. Check if you receive a confirmation email
3. Confirm the email before trying to sign in

## 🚨 **Common Causes & Solutions**

### Cause 1: User Doesn't Exist
**Solution:** Sign up first, then sign in

### Cause 2: Email Not Confirmed
**Solution:** 
1. Check your email for confirmation link
2. Click the confirmation link
3. Try signing in again

### Cause 3: Wrong Credentials
**Solution:**
1. Use the Auth Debugger to test with known credentials
2. Try creating a new test account

### Cause 4: Supabase Project Issues
**Solution:**
1. Check if your Supabase project is active
2. Verify API keys are correct
3. Check rate limits

## 🧪 **Testing Steps**

### Step 1: Test Locally
```bash
# Create .env file with your credentials
npm run dev
# Use Auth Debugger to test authentication
```

### Step 2: Test on Vercel
1. Deploy with environment variables set
2. Use Auth Debugger on deployed site
3. Compare results with local testing

### Step 3: Check Browser Console
Look for specific error messages in the browser console that might give more details about the 401 error.

## 📋 **Environment Variables Checklist**

Make sure these are set in Vercel:
- ✅ `VITE_SUPABASE_URL` = `https://xkelgvdcgtobgexigyol.supabase.co`
- ✅ `VITE_SUPABASE_ANON_KEY` = `your-actual-anon-key`

## 🔧 **Quick Fixes to Try**

1. **Clear browser cache and cookies**
2. **Try in incognito/private mode**
3. **Check if the issue happens on different browsers**
4. **Verify the user exists in Supabase dashboard**

## 📞 **Next Steps**

1. Use the Auth Debugger to get specific error details
2. Check your Supabase project settings
3. Try creating a new test user
4. If issues persist, check Supabase logs in the dashboard

The Auth Debugger will give you the exact error message and recommendations for fixing the issue. 