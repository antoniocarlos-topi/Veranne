import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CollectionBanner.module.css'
import { useScrollReveal } from '../../../hooks/useScrollReveal.js'
import { useHomepage } from '../../../context/HomepageContext.jsx'

export function CollectionBanner() {
  const navigate = useNavigate()
  const [refLeft, isVisibleLeft] = useScrollReveal()
  const [refRight, isVisibleRight] = useScrollReveal()
  const { homepage } = useHomepage()
  const { banner1, banner2 } = homepage

  return (
    <section className={styles.section} aria-label="Coleções em destaque">
      <div className={styles.grid}>
        {/* Banner esquerdo — entra da esquerda */}
        <button
          ref={refLeft}
          type="button"
          className={`${styles.banner} ${isVisibleLeft ? styles.visibleX : styles.hiddenLeft}`}
          onClick={() => navigate('/loja?featured=true')}
          aria-label="Explorar coleção Ouro"
        >
          <div
            className={styles.bg}
            style={{
              backgroundImage: `url(${banner1.imageUrl})`,
            }}
          />
          <div className={styles.overlay} />
          <div className={styles.content}>
            <div className={styles.kicker}>{banner1.title}</div>
            <div className={styles.title}>{banner1.subtitle}</div>
            <div className={styles.link}>Explorar →</div>
          </div>
        </button>

        {/* Banner direito — entra da direita */}
        <button
          ref={refRight}
          type="button"
          className={`${styles.banner} ${isVisibleRight ? styles.visibleX : styles.hiddenRight}`}
          onClick={() => navigate('/loja?featured=true')}
          aria-label="Explorar coleção Prata"
        >
          <div
            className={styles.bg}
            style={{
              backgroundImage: `url(${banner2.imageUrl})`,
            }}
          />
          <div className={styles.overlay} />
          <div className={styles.content}>
            <div className={styles.kicker}>{banner2.title}</div>
            <div className={styles.title}>{banner2.subtitle}</div>
            <div className={styles.link}>Explorar →</div>
          </div>
        </button>
      </div>
    </section>
  )
}
