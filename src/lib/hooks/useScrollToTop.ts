import { useEffect } from 'react';

/**
 * Custom hook to scroll to top immediately when the component mounts
 * This ensures that when users navigate to a new page,
 * they start at the top of the page before any content is visible.
 */
export function useScrollToTop() {
  // Scroll to top immediately
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant' // Use 'instant' for immediate scroll without animation
  });

  useEffect(() => {
    // Also scroll to top when component mounts to ensure it happens
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);
} 