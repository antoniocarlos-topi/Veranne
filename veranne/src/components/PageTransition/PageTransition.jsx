import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './PageTransition.module.css'

export function PageTransition({ children }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname || location.search !== displayLocation.search) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  function handleAnimationEnd() {
    if (transitionStage === 'fadeOut') {
      const isProductRoute = location.pathname.startsWith('/produto/')
      setTransitionStage(isProductRoute ? 'fadeInProduct' : 'fadeIn')
      setDisplayLocation(location)
      window.scrollTo(0, 0)
    }
  }

  // Clona o children (que deve ser o <Routes>) passando a location salva
  // Isso permite que o React Router mantenha a página antiga renderizada 
  // enquanto a animação de fadeOut ocorre.
  return (
    <div
      className={`${styles.transition} ${styles[transitionStage]}`}
      onAnimationEnd={handleAnimationEnd}
    >
      {React.cloneElement(children, { location: displayLocation })}
    </div>
  )
}
