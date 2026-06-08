import React, { useEffect, useRef } from 'react'
import styles from './Confetti.module.css'

export function Confetti({ active, onComplete }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return

    // Cores premium da VERANNE
    const colors = [
      '#D4AF37', // Ouro Premium
      '#FFDF00', // Ouro Amarelo
      '#E6C27A', // Ouro Claro
      '#FFFFFF', // Branco Brilhante
      '#FFB6C1', // Rosa Claro
      '#C0C0C0', // Prata
      '#FFD700', // Gold
    ]

    const isMobile = window.innerWidth < 768;
    const allElements = []
    
    const createBurst = (xPercent, yPercent, delayBurst) => {
      // Anel de choque
      const ring = document.createElement('div')
      ring.className = styles.ring
      ring.style.left = `${xPercent}%`
      ring.style.top = `${yPercent}%`
      ring.style.animationDelay = `${delayBurst}s`
      container.appendChild(ring)
      allElements.push(ring)

      // Brilho central
      const glow = document.createElement('div')
      glow.className = styles.glow
      glow.style.left = `${xPercent}%`
      glow.style.top = `${yPercent}%`
      glow.style.animationDelay = `${delayBurst}s`
      container.appendChild(glow)
      allElements.push(glow)

      const totalPieces = isMobile ? 40 : 100 // Menos peças no mobile para não travar

      for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div')
        
        const typeRand = Math.random()
        let type = 'dust'
        if (typeRand < 0.2) type = 'star'
        else if (typeRand < 0.4) type = 'diamond'
        else if (typeRand < 0.6) type = 'circle'
        else if (typeRand < 0.8) type = 'ribbon'

        piece.className = `${styles.piece} ${styles[type]}`
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = isMobile 
          ? 80 + Math.random() * 150  // Explosão menor no mobile para caber na tela
          : 150 + Math.random() * 350;
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 1.5 + Math.random() * 1.5; 
        const delay = delayBurst + Math.random() * 0.15; 
        const drop = isMobile ? '300px' : '500px';

        piece.style.cssText = `
          left: ${xPercent}%;
          top: ${yPercent}%;
          --tx: ${tx}px;
          --ty: ${ty}px;
          --color: ${color};
          --duration: ${duration}s;
          --delay: ${delay}s;
          --drop: ${drop};
          --rotate: ${Math.random() * 360}deg;
          --end-rotate: ${Math.random() * 720 - 360}deg;
          --scale: ${isMobile ? 0.4 + Math.random() * 0.6 : 0.5 + Math.random() * 1.0};
        `

        container.appendChild(piece)
        allElements.push(piece)
      }
    }

    // Sequência de explosões responsiva
    if (isMobile) {
      createBurst(50, 50, 0)       // Centro principal
      createBurst(25, 60, 0.2)     // Esquerda
      createBurst(75, 60, 0.4)     // Direita
      createBurst(50, 30, 0.8)     // Centro alto (finale)
    } else {
      createBurst(50, 60, 0)       // Centro principal
      createBurst(20, 70, 0.2)     // Esquerda inferior
      createBurst(80, 70, 0.4)     // Direita inferior
      createBurst(35, 45, 0.6)     // Esquerda meio
      createBurst(65, 45, 0.8)     // Direita meio
      createBurst(50, 30, 1.2)     // Centro alto (finale)
    }

    const timer = setTimeout(() => {
      allElements.forEach(p => p.remove())
      onComplete?.()
    }, 5500)

    return () => {
      clearTimeout(timer)
      allElements.forEach(p => p.remove())
    }
  }, [active, onComplete])

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
      aria-hidden="true"
    />
  )
}
