import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useHomepage } from '../../../context/HomepageContext'
import styles from './HeroSection.module.css'

const SLIDE_INTERVAL = 5000 // 5 segundos

export function HeroSection() {
  const { homepage } = useHomepage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)

  const images = homepage.heroImages?.length > 0
    ? homepage.heroImages
    : [homepage.heroBannerUrl]

  // Avançar slide
  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev =>
      prev === images.length - 1 ? 0 : prev + 1
    )
    setTimeout(() => setIsTransitioning(false), 800)
  }, [images.length, isTransitioning])

  // Voltar slide
  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev =>
      prev === 0 ? images.length - 1 : prev - 1
    )
    setTimeout(() => setIsTransitioning(false), 800)
  }, [images.length, isTransitioning])

  // Ir para slide específico
  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [currentIndex, isTransitioning])

  // Autoplay
  useEffect(() => {
    if (images.length <= 1) return
    intervalRef.current = setInterval(nextSlide, SLIDE_INTERVAL)
    return () => clearInterval(intervalRef.current)
  }, [nextSlide, images.length])

  // Pausar ao hover
  function handleMouseEnter() {
    clearInterval(intervalRef.current)
  }
  function handleMouseLeave() {
    if (images.length <= 1) return
    intervalRef.current = setInterval(nextSlide, SLIDE_INTERVAL)
  }

  return (
    <section
      className={styles.hero}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides de imagem */}
      <div className={styles.slidesWrapper}>
        {images.map((img, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentIndex ? styles.slideActive : ''
            }`}
            style={{ backgroundImage: `url(${img})` }}
            aria-hidden={index !== currentIndex}
          />
        ))}
      </div>

      {/* Overlay gradiente */}
      <div className={styles.overlay} />

      {/* Conteúdo do hero */}
      <div className={styles.content}>
        <span className={styles.label}>
          {homepage.heroLabel}
        </span>
        <h1 className={styles.title}>
          {homepage.heroTitle}
        </h1>
        <p className={styles.subtitle}>
          {homepage.heroSubtitle}
        </p>
        <div className={styles.buttons}>
          <Link to="/loja" className={styles.btnPrimary}>
            Comprar Agora
          </Link>
          <Link to="/loja" className={styles.btnSecondary}>
            Ver Coleção
          </Link>
        </div>
      </div>

      {/* Setas de navegação — apenas se houver mais de 1 imagem */}
      {images.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={prevSlide}
            aria-label="Imagem anterior"
          >
            ‹
          </button>
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={nextSlide}
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </>
      )}

      {/* Dots indicadores */}
      {images.length > 1 && (
        <div className={styles.dots}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentIndex ? styles.dotActive : ''
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Indicador de scroll */}
      <div className={styles.scrollIndicator}>
        <span />
      </div>
    </section>
  )
}
