import { useEffect } from 'react';

/**
 * Custom hook to scroll to top when the component mounts
 * This ensures that when users navigate to a new page,
 * they start at the top of the page.
 */
export function useScrollToTop() {
  useEffect(() => {
    // Scroll to top with smooth behavior for better UX
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
} 