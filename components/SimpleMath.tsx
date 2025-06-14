"use client"

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    MathJax: any;
    typesetMath: (element: HTMLElement | null) => void;
    MathJaxReady: boolean;
  }
}

interface SimpleMathProps {
  children: string
  className?: string
}

export default function SimpleMath({ children, className = "" }: SimpleMathProps) {
  const mathRef = useRef<HTMLSpanElement>(null);
  const [isMathJaxProcessed, setIsMathJaxProcessed] = useState(false);

  useEffect(() => {
    const currentRef = mathRef.current;
    if (!currentRef) return;

    // Set raw content initially
    currentRef.innerHTML = children;
    setIsMathJaxProcessed(false); // Mark as not processed yet for this new child

    const doTypeset = () => {
      if (typeof window !== 'undefined' && window.typesetMath && currentRef) {
        console.log('SimpleMath: Attempting to typeset content:', children.substring(0, 30));
        window.typesetMath(currentRef);
        // We don't have a direct promise here, so we rely on visual change or a small delay
        // For now, we'll assume it will process or log errors via the global function
        // To get a more robust callback, `typesetMath` would need to return a promise
        // or use a callback system.
        // For simplicity, we use a timeout to mark as processed for styling purposes.
        setTimeout(() => setIsMathJaxProcessed(true), 100); 
      } else {
        console.warn('SimpleMath: MathJax or typesetMath function not available yet. Retrying...');
        // Retry mechanism if MathJax is not ready
        setTimeout(doTypeset, 300); 
      }
    };

    // Check if MathJax is ready via custom event or directly
    if (typeof window !== 'undefined' && window.MathJaxReady) {
      doTypeset();
    } else if (typeof window !== 'undefined') {
      const readyListener = () => {
        console.log('SimpleMath: MathJaxReady event received.');
        window.MathJaxReady = true; // Mark it globally
        doTypeset();
        window.removeEventListener('MathJaxReady', readyListener);
      };
      window.addEventListener('MathJaxReady', readyListener);
      // Initial attempt even if event not caught yet, in case MathJax loaded extremely fast
      setTimeout(doTypeset, 50); 
    }

    // Cleanup function for the event listener (though with once:true it might be redundant)
    return () => {
      if (typeof window !== 'undefined') {
        // window.removeEventListener('MathJaxReady', readyListener); // Covered by once or if we improve listener
      }
    };
  }, [children]); // Re-run when children change

  return (
    <span
      ref={mathRef}
      className={`${className}`}
      // The content will be set by innerHTML in useEffect
      // Initial children are set to avoid flash of unstyled content if MathJax is slow,
      // but will be overwritten.
      // style={{ opacity: isMathJaxProcessed ? 1 : 0.5 }} // Example for visual feedback
    />
  );
} 