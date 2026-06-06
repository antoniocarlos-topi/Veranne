import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './HeroSection.module.css'

import { useHomepage } from '../../../context/HomepageContext.jsx'

export function HeroSection() {
  const [showIndicator, setShowIndicator] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const navigate = useNavigate()
  const { homepage } = useHomepage()

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || 0
      setShowIndicator(y < 40)
      setScrollY(y)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className={styles.hero} aria-label="Hero VERANNE">
      <div 
        className={styles.bg} 
        style={{ 
          backgroundImage: `url(${homepage.heroBannerUrl})`,
          transform: `scale(1.02) translateY(${scrollY * 0.35}px)`
        }} 
      />
      <div className={styles.overlay} />

      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={`${styles.label} ${styles.fadeInUp}`}>
            {homepage.heroLabel}
          </div>

          <h1 className={`${styles.title} ${styles.fadeInUp}`}>
            {homepage.heroTitle}
          </h1>

          <p className={`${styles.subtitle} ${styles.fadeInUp}`}>
            {homepage.heroSubtitle}
          </p>

          <div className={`${styles.actions} ${styles.fadeInUp}`}>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate('/loja')}
              type="button"
            >
              Comprar Agora
            </button>
            <button className={styles.outlineBtn} onClick={() => navigate('/loja')} type="button">
              Ver Coleção
            </button>
          </div>
        </div>

        {showIndicator ? (
          <div className={styles.scrollIndicator} aria-hidden="true">
            <div className={styles.chevron} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
