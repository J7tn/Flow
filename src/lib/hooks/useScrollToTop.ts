import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to scroll to top when the route changes
 * This ensures that when users navigate from one page to another,
 * they start at the top of the new page instead of maintaining
 * the scroll position from the previous page.
 */
export function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top with smooth behavior for better UX
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);
} 