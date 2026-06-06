import React, { useEffect, useRef } from 'react'
import styles from './Confetti.module.css'

export function Confetti({ active, onComplete }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    // Cores elegantes da VERANNE
    const colors = [
      '#C9A96E', // dourado
      '#C0C0C0', // prata
      '#000000', // preto
      '#E8E8E8', // cinza claro
      '#D4AF78', // dourado claro
    ]

    const pieces = []
    const totalPieces = 60

    for (let i = 0; i < totalPieces; i++) {
      const piece = document.createElement('div')
      
      // Variar entre formas: quadrado, círculo, linha
      const shape = i % 3 === 0 ? 'circle' 
                  : i % 3 === 1 ? 'square' 
                  : 'line'

      piece.className = `${styles.piece} ${styles[shape]}`
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-delay: ${Math.random() * 0.4}s;
        animation-duration: ${0.8 + Math.random() * 0.6}s;
        --rotate: ${Math.random() * 720 - 360}deg;
        --x: ${Math.random() * 200 - 100}px;
      `
      container.appendChild(piece)
      pieces.push(piece)
    }

    // Limpar após animação
    const timer = setTimeout(() => {
      pieces.forEach(p => p.remove())
      onComplete?.()
    }, 1800)

    return () => {
      clearTimeout(timer)
      pieces.forEach(p => p.remove())
    }
  }, [active])

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
      aria-hidden="true"
    />
  )
}
