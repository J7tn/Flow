// Email service utility for handling contact form submissions
// This uses EmailJS as a simple solution for sending emails from the frontend

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

// Initialize EmailJS (you'll need to add EmailJS to your dependencies)
// npm install @emailjs/browser
let emailjs: any = null;

// Lazy load EmailJS to avoid SSR issues
const loadEmailJS = async () => {
  if (!emailjs) {
    try {
      const { default: EmailJS } = await import('@emailjs/browser');
      emailjs = EmailJS;
      // Initialize with your EmailJS public key
      emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your-public-key');
    } catch (error) {
      console.error('Failed to load EmailJS:', error);
      return false;
    }
  }
  return true;
};

export const sendContactEmail = async (formData: ContactFormData): Promise<EmailResponse> => {
  try {
    // Check if EmailJS is configured
    const emailjsLoaded = await loadEmailJS();
    const hasEmailJSConfig = import.meta.env.VITE_EMAILJS_PUBLIC_KEY && 
                            import.meta.env.VITE_EMAILJS_SERVICE_ID && 
                            import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!emailjsLoaded || !hasEmailJSConfig) {
      // Fallback to opening email client
      const subject = `Flow Contact: ${formData.subject}`;
      const body = `Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`;
      
      openEmailClient(subject, body);
      
      return {
        success: true,
        message: 'Your default email client has been opened with your message. Please send the email to complete your inquiry.'
      };
    }

    // Prepare email template parameters
    const templateParams = {
      to_email: 'jntnnn4@gmail.com',
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      subject: `Flow Contact: ${formData.subject}`,
      message: formData.message,
      reply_to: formData.email,
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your-service-id',
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your-template-id',
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Thank you! Your message has been sent successfully.'
      };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Fallback to opening email client
    const subject = `Flow Contact: ${formData.subject}`;
    const body = `Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`;
    
    openEmailClient(subject, body);
    
    return {
      success: true,
      message: 'There was an issue with the email service. Your default email client has been opened with your message. Please send the email to complete your inquiry.'
    };
  }
};

// Fallback function that opens default email client
export const openEmailClient = (subject: string, body: string) => {
  const email = 'jntnnn4@gmail.com';
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink, '_blank');
};

// Function to handle direct email links
export const handleEmailAction = (action: string, subject?: string) => {
  const email = 'jntnnn4@gmail.com';
  let mailtoSubject = '';
  
  switch (action) {
    case 'send-email':
      mailtoSubject = 'Flow Inquiry';
      break;
    case 'get-support':
      mailtoSubject = 'Flow Support Request';
      break;
    default:
      mailtoSubject = subject || 'Flow Contact';
  }
  
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(mailtoSubject)}`;
  window.open(mailtoLink, '_blank');
}; 