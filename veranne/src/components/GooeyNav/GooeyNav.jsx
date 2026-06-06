// ============================================================
// VERANNE — GooeyNav
// Navegação desktop com efeito gooey/blob
// ============================================================

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './GooeyNav.css'

const NAV_ITEMS = [
  { label: 'Home',    href: '/'        },
  { label: 'Loja',    href: '/loja'    },
  { label: 'Sobre',   href: '/sobre'   },
  { label: 'Contato', href: '/contato' },
]

// Cores das partículas VERANNE
const PARTICLE_COLORS = ['#C9A96E', '#C0C0C0', '#1a1a1a', '#E8E8E8']

export function GooeyNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const ulRef = useRef(null)
  const blobRef = useRef(null)
  const itemRefs = useRef([])
  const particlesRef = useRef([])

  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = NAV_ITEMS.findIndex(item => item.href === location.pathname)
    return idx !== -1 ? idx : 0
  })
  const [hoverIndex, setHoverIndex] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Sincronizar com rota atual
  useEffect(() => {
    const idx = NAV_ITEMS.findIndex(item => item.href === location.pathname)
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx)
    }
  }, [location.pathname])

  // Posicionar blob no item ativo ou hover
  const currentBlobIndex = hoverIndex !== null ? hoverIndex : activeIndex

  const updateBlob = useCallback(() => {
    const item = itemRefs.current[currentBlobIndex]
    const blob = blobRef.current
    if (!item || !blob) return

    const ul = ulRef.current
    if (!ul) return

    const ulRect = ul.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()

    blob.style.width = `${itemRect.width}px`
    blob.style.transform = `translateX(${itemRect.left - ulRect.left}px)`
  }, [currentBlobIndex])

  useEffect(() => {
    updateBlob()
  }, [currentBlobIndex, updateBlob])

  // Recalcular ao redimensionar
  useEffect(() => {
    const handleResize = () => updateBlob()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateBlob])

  // Criar partículas durante transição
  const spawnParticles = useCallback((fromIdx, toIdx) => {
    const ul = ulRef.current
    if (!ul) return

    const fromItem = itemRefs.current[fromIdx]
    const toItem = itemRefs.current[toIdx]
    if (!fromItem || !toItem) return

    const ulRect = ul.getBoundingClientRect()
    const fromRect = fromItem.getBoundingClientRect()
    const toRect = toItem.getBoundingClientRect()

    const fromCenter = fromRect.left + fromRect.width / 2 - ulRect.left
    const toCenter = toRect.left + toRect.width / 2 - ulRect.left

    // Criar partículas ao longo do caminho
    const count = 6
    particlesRef.current.forEach(p => p?.remove())
    particlesRef.current = []

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = 'gooey-particle'
      const t = i / (count - 1)
      const x = fromCenter + (toCenter - fromCenter) * t
      const y = (ulRect.height / 2) + (Math.random() - 0.5) * 16
      const size = 4 + Math.random() * 6
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]

      particle.style.cssText = `
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        opacity: 0.8;
      `

      ul.appendChild(particle)
      particlesRef.current.push(particle)

      // Animar e remover
      setTimeout(() => {
        particle.style.opacity = '0'
        particle.style.transform = `translateY(${(Math.random() - 0.5) * 20}px) scale(0)`
        particle.style.transition = 'all 0.5s ease-out'
        setTimeout(() => particle.remove(), 500)
      }, 100 + i * 50)
    }
  }, [])

  function handleClick(e, index) {
    e.preventDefault()

    if (index === activeIndex) return

    setIsTransitioning(true)
    spawnParticles(activeIndex, index)
    setActiveIndex(index)
    navigate(NAV_ITEMS[index].href)

    setTimeout(() => setIsTransitioning(false), 500)
  }

  return (
    <div className="gooeyNavWrapper">
      {/* SVG filter para efeito gooey */}
      <svg className="gooey-filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <nav className={`gooey-nav ${isTransitioning ? 'transitioning' : ''}`}>
        <div className="gooey-effect-container">
          <ul ref={ulRef}>
            <div className="gooey-blob" ref={blobRef} />
            {NAV_ITEMS.map((item, index) => (
              <li
                key={item.href}
                ref={el => { itemRefs.current[index] = el }}
                className={index === currentBlobIndex ? 'gooey-active' : ''}
                onClick={(e) => handleClick(e, index)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e, index) }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}
