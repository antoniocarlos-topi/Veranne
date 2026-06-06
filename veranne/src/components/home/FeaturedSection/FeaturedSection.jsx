import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './FeaturedSection.module.css'
import { useScrollReveal } from '../../../hooks/useScrollReveal.js'
import { useStaggerReveal } from '../../../hooks/useStaggerReveal.js'
import { useProductsContext } from '../../../context/ProductsContext.jsx'
import { useHomepage } from '../../../context/HomepageContext.jsx'
import ProductGrid from '../../ProductGrid/ProductGrid.jsx'

export function FeaturedSection() {
  const navigate = useNavigate()
  const [headerRef, headerVisible] = useScrollReveal()
  const [gridRef, gridVisible] = useStaggerReveal({ threshold: 0.06 })
  const { getFeaturedProducts, products } = useProductsContext()
  const { homepage } = useHomepage()

  const featured = useMemo(() => {
    if (homepage.featuredIds && homepage.featuredIds.length > 0) {
      const fromAdmin = products.filter(p => 
        homepage.featuredIds.includes(p.id) && p.inStock
      )
      if (fromAdmin.length > 0) return fromAdmin.slice(0, 8)
    }
    return getFeaturedProducts().slice(0, 8)
  }, [getFeaturedProducts, products, homepage.featuredIds])

  return (
    <section className={styles.section} aria-label="Peças em Destaque">
      {/* Título + subtítulo com scroll reveal */}
      <div
        ref={headerRef}
        className={headerVisible ? styles.visible : styles.hidden}
      >
        <h2 className={styles.title}>Peças em Destaque</h2>
        <div className={styles.subtitle}>Selecionadas especialmente para você</div>
      </div>

      {/* Grid com stagger — ref no wrapper, classes via gridVisible */}
      <div ref={gridRef}>
        <ProductGrid
          products={featured}
          loading={false}
          emptyMessage="Nenhum produto em destaque."
          staggerVisible={gridVisible}
        />
      </div>

      <div className={styles.ctaWrap}>
        <button type="button" className={styles.ctaBtn} onClick={() => navigate('/loja')}>
          Ver toda a coleção
        </button>
      </div>
    </section>
  )
}
