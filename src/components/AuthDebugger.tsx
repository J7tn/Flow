import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthDebuggerProps {
  isVisible?: boolean;
}

const AuthDebugger: React.FC<AuthDebuggerProps> = ({ isVisible = false }) => {
  const [isOpen, setIsOpen] = useState(isVisible);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('testpassword123');
  const [showPassword, setShowPassword] = useState(false);

  const runAuthTests = async () => {
    setIsTesting(true);
    setTestResults(null);

    const results = {
      clientCreation: false,
      authSettings: null,
      signUpTest: null,
      signInTest: null,
      error: null
    };

    try {
      // Test 1: Client Creation
      const client = supabase();
      if (client) {
        results.clientCreation = true;
      } else {
        results.error = 'Failed to create Supabase client';
        setTestResults(results);
        setIsTesting(false);
        return;
      }

      // Test 2: Auth Settings
      try {
        const { data: { session }, error } = await client.auth.getSession();
        results.authSettings = {
          hasSession: !!session,
          error: error?.message || null
        };
      } catch (error) {
        results.authSettings = {
          hasSession: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      // Test 3: Sign Up Test
      try {
        const { data, error } = await client.auth.signUp({
          email: testEmail,
          password: testPassword,
        });
        results.signUpTest = {
          success: !error,
          user: data.user,
          error: error?.message || null,
          needsConfirmation: data.user && !data.session
        };
      } catch (error) {
        results.signUpTest = {
          success: false,
          user: null,
          error: error instanceof Error ? error.message : 'Unknown error',
          needsConfirmation: false
        };
      }

      // Test 4: Sign In Test
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });
        results.signInTest = {
          success: !error,
          user: data.user,
          session: data.session,
          error: error?.message || null
        };
      } catch (error) {
        results.signInTest = {
          success: false,
          user: null,
          session: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

    } catch (error) {
      results.error = error instanceof Error ? error.message : 'Unknown error';
    }

    setTestResults(results);
    setIsTesting(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          🔐 Auth Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
      <Card className="bg-background/95 backdrop-blur-sm border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Authentication Debugger</span>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Credentials */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Test Credentials</Label>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="text-xs"
              />
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="testpassword123"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="text-xs pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Run Tests Button */}
          <Button
            onClick={runAuthTests}
            disabled={isTesting}
            className="w-full"
            size="sm"
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              'Run Auth Tests'
            )}
          </Button>

          {/* Test Results */}
          {testResults && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Test Results</h4>
              
              {/* Client Creation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {testResults.clientCreation ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs">Client Creation</span>
                </div>
                <Badge variant={testResults.clientCreation ? 'default' : 'destructive'} className="text-xs">
                  {testResults.clientCreation ? 'Success' : 'Failed'}
                </Badge>
              </div>

              {/* Auth Settings */}
              {testResults.authSettings && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-xs">Auth Settings</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testResults.authSettings.hasSession ? 'Session Found' : 'No Session'}
                    </Badge>
                  </div>
                  {testResults.authSettings.error && (
                    <p className="text-xs text-red-600">{testResults.authSettings.error}</p>
                  )}
                </div>
              )}

              {/* Sign Up Test */}
              {testResults.signUpTest && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {testResults.signUpTest.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs">Sign Up Test</span>
                    </div>
                    <Badge variant={testResults.signUpTest.success ? 'default' : 'destructive'} className="text-xs">
                      {testResults.signUpTest.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                  {testResults.signUpTest.error && (
                    <p className="text-xs text-red-600">{testResults.signUpTest.error}</p>
                  )}
                  {testResults.signUpTest.needsConfirmation && (
                    <p className="text-xs text-yellow-600">User created but needs email confirmation</p>
                  )}
                </div>
              )}

              {/* Sign In Test */}
              {testResults.signInTest && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {testResults.signInTest.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-xs">Sign In Test</span>
                    </div>
                    <Badge variant={testResults.signInTest.success ? 'default' : 'destructive'} className="text-xs">
                      {testResults.signInTest.success ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                  {testResults.signInTest.error && (
                    <p className="text-xs text-red-600">{testResults.signInTest.error}</p>
                  )}
                </div>
              )}

              {/* General Error */}
              {testResults.error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-xs">{testResults.error}</AlertDescription>
                </Alert>
              )}

              {/* Recommendations */}
              <div className="pt-2 border-t">
                <h5 className="text-xs font-medium mb-2">Recommendations:</h5>
                <div className="text-xs space-y-1 text-muted-foreground">
                  {testResults.signInTest?.error?.includes('Invalid login credentials') && (
                    <p>• User doesn't exist - try signing up first</p>
                  )}
                  {testResults.signUpTest?.needsConfirmation && (
                    <p>• Check your email for confirmation link</p>
                  )}
                  {testResults.signInTest?.error?.includes('Email not confirmed') && (
                    <p>• Confirm your email address first</p>
                  )}
                  {testResults.authSettings?.error?.includes('Invalid API key') && (
                    <p>• Check your Supabase anon key in Vercel environment variables</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebugger; 