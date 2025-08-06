import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  transitionType?: 'fade' | 'slide' | 'scale';
}

export function PageTransition({ 
  children, 
  className = '',
  transitionType = 'fade'
}: PageTransitionProps) {
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      }
    },
    slide: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
      }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      }
    }
  };

  const selectedTransition = transitions[transitionType];

  return (
    <motion.div
      initial={selectedTransition.initial}
      animate={selectedTransition.animate}
      exit={selectedTransition.exit}
      transition={selectedTransition.transition}
      className={`page-transition-container page-content ${className}`}
      style={{
        // Ensure smooth rendering
        backfaceVisibility: 'hidden',
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
} 