import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Users } from 'lucide-react';

export const BypassLogin: React.FC = () => {
  const { enableBypass, bypassMode, user } = useAuth();
  const navigate = useNavigate();

  // Auto-navigate when bypass mode is enabled and user is set
  useEffect(() => {
    if (bypassMode && user) {
      console.log('BypassLogin: Bypass mode and user detected, navigating to dashboard...');
      navigate('/dashboard');
    }
  }, [bypassMode, user, navigate]);

  const handleBypass = () => {
    console.log('BypassLogin: Enabling bypass mode...');
    enableBypass();
  };

  const handleDebug = () => {
    console.log('BypassLogin: Debug info:', {
      bypassMode,
      user,
      hasUser: !!user,
      userEmail: user?.email
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Friend Access</CardTitle>
          <CardDescription>
            Skip login and explore Flow with limited features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Access to templates and basic features</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>No data will be saved permanently</span>
            </div>
          </div>
          
          <Button 
            onClick={handleBypass} 
            className="w-full"
            size="lg"
          >
            Continue as Friend
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            Current state: {bypassMode ? 'Bypass Mode: ON' : 'Bypass Mode: OFF'} | 
            User: {user ? 'Logged In' : 'Not Logged In'}
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleDebug}
            className="w-full text-xs"
            size="sm"
          >
            Debug State
          </Button>
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/login')}
              className="text-sm"
            >
              Or sign in with your account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 