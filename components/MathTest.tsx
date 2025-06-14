"use client"

import { useEffect, useState } from 'react'

export default function MathTest() {
  const [mathJaxReady, setMathJaxReady] = useState(false)

  useEffect(() => {
    const checkMathJax = () => {
      if (typeof window !== 'undefined' && window.MathJax) {
        console.log('MathJax found:', window.MathJax)
        setMathJaxReady(true)
        
        // Test render
        const testElement = document.getElementById('math-test')
        if (testElement && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([testElement]).then(() => {
            console.log('MathJax rendered successfully')
          }).catch((err: any) => {
            console.error('MathJax error:', err)
          })
        }
      } else {
        setTimeout(checkMathJax, 500)
      }
    }

    checkMathJax()
  }, [])

  return (
    <div className="p-4 border rounded bg-yellow-50">
      <h3>MathJax Test</h3>
      <p>Status: {mathJaxReady ? '✅ Ready' : '⏳ Loading...'}</p>
      <div id="math-test">
        <p>Test inline: \( x^2 + y^2 = z^2 \)</p>
        <p>Test display: \[ \int_0^1 x^2 dx = \frac{1}{3} \]</p>
        <p>Test frac: \( \frac{f(x+h) - f(x)}{h} \)</p>
      </div>
    </div>
  )
} 