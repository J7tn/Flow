import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
}) => {
  const { user, loading, bypassMode } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', {
    path: location.pathname,
    requireAuth,
    user: user ? 'Authenticated' : 'Not authenticated',
    bypassMode,
    loading,
    redirectTo
  });

  if (loading) {
    console.log('ProtectedRoute: Loading state, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user && !bypassMode) {
    console.log('ProtectedRoute: Requiring auth but no user and not in bypass mode, redirecting to:', redirectTo);
    console.log('ProtectedRoute: Details - user:', user, 'bypassMode:', bypassMode);
    // Redirect to login page with return URL
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    console.log('ProtectedRoute: User authenticated but on auth page, redirecting to dashboard');
    // Redirect authenticated users away from auth pages
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
}; 