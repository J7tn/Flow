import { useLocation } from 'react-router-dom';

export function usePageTransition() {
  const location = useLocation();
  
  // Define transition types for different routes
  const getTransitionType = (pathname: string): 'fade' | 'slide' | 'scale' => {
    // Landing page and main marketing pages use fade
    if (['/', '/features', '/pricing', '/about', '/contact'].includes(pathname)) {
      return 'fade';
    }
    
    // Dashboard and workflow pages use slide
    if (pathname.startsWith('/dashboard') || 
        pathname.startsWith('/workflow') || 
        pathname.startsWith('/flows') ||
        pathname.startsWith('/analytics')) {
      return 'slide';
    }
    
    // Settings and detail pages use scale
    if (pathname.startsWith('/settings') || 
        pathname.startsWith('/templates/') ||
        pathname.startsWith('/calendar')) {
      return 'scale';
    }
    
    // Default to fade for other pages
    return 'fade';
  };
  
  return {
    transitionType: getTransitionType(location.pathname),
    pathname: location.pathname
  };
} 