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
    return CATEGORIES.map(c => {
      let img = ''
      if (c.id === 'todos') {
        img = homepage.categoryImages?.todos || homepage.allCategoriesImage || ''
      } else {
        img = homepage.categoryImages?.[c.slug] || ''
      }
      return { ...c, img }
    })
  }, [homepage.categoryImages, homepage.allCategoriesImage])

  function handleImgError(e) {
    e.currentTarget.style.display = 'none'
    // Show the fallback gradient behind
    const wrap = e.currentTarget.closest(`.${styles.imgWrap}`)
    if (wrap) wrap.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)'
  }

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
              {c.img ? (
                <img className={styles.img} src={c.img} alt={c.label} loading="lazy" onError={handleImgError} />
              ) : (
                <div className={styles.imgPlaceholder} />
              )}
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
