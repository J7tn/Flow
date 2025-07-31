import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export const EmailConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Handle different types of confirmation URLs
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const token = searchParams.get('token');

        console.log('Email confirmation params:', { accessToken, refreshToken, type, token });

        if (accessToken && refreshToken) {
          // Direct session confirmation
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          setStatus('success');
          setMessage('Your email has been successfully confirmed! You can now sign in to your account.');
        } else if (type === 'signup' && token) {
          // Email confirmation with token
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });

          if (error) {
            throw error;
          }

          setStatus('success');
          setMessage('Your email has been successfully confirmed! You can now sign in to your account.');
        } else if (type === 'recovery' && token) {
          // Password recovery confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery',
          });

          if (error) {
            throw error;
          }

          setStatus('success');
          setMessage('Your password has been successfully reset! You can now sign in with your new password.');
        } else {
          // Try to get the current session to see if user is already confirmed
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user?.email_confirmed_at) {
            setStatus('success');
            setMessage('Your email is already confirmed! You can sign in to your account.');
          } else {
            setStatus('error');
            setMessage('Invalid confirmation link. Please check your email and try again.');
          }
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage('There was an error confirming your email. Please try again or contact support.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  const handleSignIn = () => {
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleResendEmail = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            {status === 'loading' && (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            )}
            {status === 'success' && (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            {status === 'error' && (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Error'}
          </CardTitle>
          <CardDescription className="text-base">
            {status === 'loading' && 'Please wait while we confirm your email address.'}
            {status === 'success' && 'Your account has been successfully activated.'}
            {status === 'error' && 'We encountered an issue with your confirmation.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {message}
          </p>
          
          {status === 'success' && (
            <div className="space-y-3">
              <Button 
                onClick={handleSignIn} 
                className="w-full"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Sign In to Your Account
              </Button>
              <Button 
                onClick={handleGoHome} 
                variant="outline" 
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={handleSignIn} 
                className="w-full"
              >
                Try Signing In
              </Button>
              <Button 
                onClick={handleResendEmail} 
                variant="outline" 
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Resend Confirmation Email
              </Button>
              <Button 
                onClick={handleGoHome} 
                variant="ghost" 
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="text-center text-gray-500">
              <p>This may take a few moments...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 