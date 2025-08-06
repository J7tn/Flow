# Email Setup for Contact Form

The contact form in Flow is designed to work with EmailJS for seamless email delivery. Here's how to set it up:

## Current Implementation

The contact form currently works with a fallback system:
1. **Primary**: Uses EmailJS to send emails directly from the frontend
2. **Fallback**: Opens the user's default email client with a pre-filled message

## Setting Up EmailJS (Optional)

To enable direct email sending without opening the email client:

### 1. Create EmailJS Account
1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Design your template with these variables:
   - `{{to_email}}` - Recipient email
   - `{{from_name}}` - Sender's full name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Email subject
   - `{{message}}` - Email message
   - `{{reply_to}}` - Reply-to email
4. Note your **Template ID**

### 4. Get Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

### 5. Add Environment Variables
Add these to your `.env` file:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

## Email Template Example

Here's a sample EmailJS template:

```html
Subject: {{subject}}

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from the Flow contact form.
Reply to: {{reply_to}}
```

## Current Functionality

Without EmailJS setup, the contact form will:
1. Validate all form fields
2. Show appropriate error messages
3. Open the user's default email client
4. Pre-fill the email with the form data
5. Allow the user to send the email manually

This ensures the contact form works immediately without any additional setup.

## Testing

To test the contact form:
1. Fill out the form with valid data
2. Click "Send Message"
3. Your default email client should open with a pre-filled message
4. Send the email to jntnnn4@gmail.com

## Troubleshooting

- If the email client doesn't open, check if your browser allows popups
- Ensure all form fields are filled out correctly
- Check the browser console for any JavaScript errors 