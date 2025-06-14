"use client"

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    MathJax: any
  }
}

interface MathRendererProps {
  children: string
  className?: string
}

export default function MathRenderer({ children, className = "" }: MathRendererProps) {
  const mathRef = useRef<HTMLDivElement>(null)
  const [mathJaxReady, setMathJaxReady] = useState(false)

  useEffect(() => {
    // Check if MathJax is already loaded
    if (window.MathJax && window.MathJax.typesetPromise) {
      setMathJaxReady(true)
      return
    }

    // Wait for MathJax to load
    const checkMathJax = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        setMathJaxReady(true)
      } else {
        setTimeout(checkMathJax, 100)
      }
    }

    checkMathJax()
  }, [])

  useEffect(() => {
    if (!mathJaxReady || !mathRef.current) return

    const renderMath = async () => {
      try {
        if (window.MathJax && window.MathJax.typesetPromise) {
          // Clear previous content
          if (mathRef.current) {
            mathRef.current.innerHTML = children
          }
          
          // Render math
          await window.MathJax.typesetPromise([mathRef.current])
        }
      } catch (error) {
        console.error('MathJax rendering error:', error)
        // Fallback: just display the raw content
        if (mathRef.current) {
          mathRef.current.innerHTML = children
        }
      }
    }

    renderMath()
  }, [mathJaxReady, children])

  return (
    <div 
      ref={mathRef} 
      className={className}
    >
      {/* Initial content before MathJax renders */}
      {!mathJaxReady && <span dangerouslySetInnerHTML={{ __html: children }} />}
    </div>
  )
} 