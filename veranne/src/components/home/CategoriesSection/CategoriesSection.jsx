import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CategoriesSection.module.css'
import { CATEGORIES } from '../../../data/products.js'
import { useScrollReveal } from '../../../hooks/useScrollReveal.js'
import { useStaggerReveal } from '../../../hooks/useStaggerReveal.js'
import { useHomepage } from '../../../context/HomepageContext.jsx'

export function CategoriesSection() {
  const navigate = useNavigate()
  const [titleRef, titleVisible] = useScrollReveal()
  const [gridRef, gridVisible] = useStaggerReveal()
  const { homepage } = useHomepage()

  const cats = useMemo(() => {
    return CATEGORIES.map(c => ({
      ...c,
      img: homepage.categories?.[c.slug]?.imageUrl || ''
    }))
  }, [homepage.categories])

  return (
    <section className={styles.section} aria-label="Categorias">
      {/* Título com scroll reveal padrão */}
      <div
        ref={titleRef}
        className={`${styles.titleBlock} ${titleVisible ? styles.visible : styles.hidden}`}
      >
        <h2 className={styles.title}>Explore nossas categorias</h2>
      </div>

      {/* Grid com stagger */}
      <div ref={gridRef} className={styles.grid}>
        {cats.map(c => (
          <button
            key={c.id}
            type="button"
            className={`${styles.card} staggerItem ${gridVisible ? 'visible' : 'hidden'}`}
            onClick={() => navigate(`/loja?categoria=${c.slug}`)}
            aria-label={`Ver categoria ${c.label}`}
          >
            <div className={styles.imgWrap}>
              <img className={styles.img} src={c.img} alt={c.label} loading="lazy" />
              <div className={styles.imgOverlay} />
              <div className={styles.cardText}>
                <div className={styles.cardName}>{c.label}</div>
                <div className={styles.cardLink}>Ver coleção →</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
