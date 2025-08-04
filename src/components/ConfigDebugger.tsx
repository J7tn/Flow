import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ConfigDebuggerProps {
  isVisible?: boolean;
}

const ConfigDebugger: React.FC<ConfigDebuggerProps> = ({ isVisible = false }) => {
  const [isOpen, setIsOpen] = React.useState(isVisible);

  const config = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    chat2apiUrl: import.meta.env.VITE_CHAT2API_URL,
    chat2apiAuth: import.meta.env.VITE_CHAT2API_AUTHORIZATION,
    environment: import.meta.env.MODE,
    isProduction: import.meta.env.PROD,
    isDevelopment: import.meta.env.DEV,
  };

  const checks = [
    {
      name: 'Supabase URL',
      value: config.supabaseUrl,
      isValid: !!config.supabaseUrl && config.supabaseUrl.startsWith('https://'),
      icon: config.supabaseUrl && config.supabaseUrl.startsWith('https://') ? CheckCircle : XCircle,
      color: config.supabaseUrl && config.supabaseUrl.startsWith('https://') ? 'text-green-500' : 'text-red-500',
    },
    {
      name: 'Supabase Anon Key',
      value: config.supabaseAnonKey,
      isValid: !!config.supabaseAnonKey && config.supabaseAnonKey.startsWith('eyJ'),
      icon: config.supabaseAnonKey && config.supabaseAnonKey.startsWith('eyJ') ? CheckCircle : XCircle,
      color: config.supabaseAnonKey && config.supabaseAnonKey.startsWith('eyJ') ? 'text-green-500' : 'text-red-500',
    },
    {
      name: 'Chat2API URL',
      value: config.chat2apiUrl,
      isValid: !!config.chat2apiUrl,
      icon: config.chat2apiUrl ? CheckCircle : AlertCircle,
      color: config.chat2apiUrl ? 'text-green-500' : 'text-yellow-500',
    },
    {
      name: 'Chat2API Auth',
      value: config.chat2apiAuth,
      isValid: !!config.chat2apiAuth,
      icon: config.chat2apiAuth ? CheckCircle : AlertCircle,
      color: config.chat2apiAuth ? 'text-green-500' : 'text-yellow-500',
    },
  ];

  const allValid = checks.every(check => check.isValid);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          🔧 Config Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-background/95 backdrop-blur-sm border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Configuration Debugger</span>
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
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {checks.map((check) => {
              const IconComponent = check.icon;
              return (
                <div key={check.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${check.color}`} />
                    <span className="text-sm font-medium">{check.name}</span>
                  </div>
                  <Badge variant={check.isValid ? 'default' : 'destructive'} className="text-xs">
                    {check.isValid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
              );
            })}
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Environment: {config.environment}</span>
              <span>{config.isProduction ? 'Production' : 'Development'}</span>
            </div>
          </div>

          {!allValid && (
            <div className="pt-2 border-t">
              <div className="text-xs text-red-600 space-y-1">
                <p className="font-medium">Issues Found:</p>
                {!config.supabaseUrl && <p>• Supabase URL is missing</p>}
                {!config.supabaseAnonKey && <p>• Supabase Anon Key is missing</p>}
                {config.supabaseUrl && !config.supabaseUrl.startsWith('https://') && (
                  <p>• Supabase URL must start with https://</p>
                )}
                {config.supabaseAnonKey && !config.supabaseAnonKey.startsWith('eyJ') && (
                  <p>• Supabase Anon Key format is invalid</p>
                )}
                <p className="mt-2 font-medium">
                  {config.isProduction 
                    ? 'Add these to your Vercel environment variables'
                    : 'Update your .env file with the correct values'
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigDebugger; 