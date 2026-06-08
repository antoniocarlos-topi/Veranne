import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProductsContext } from '../../../context/ProductsContext'
import ProductGrid from '../../ProductGrid/ProductGrid'
import styles from './AllProductsSection.module.css'
import { useScrollReveal } from '../../../hooks/useScrollReveal'
import { useStaggerReveal } from '../../../hooks/useStaggerReveal'

export function AllProductsSection() {
  const { products } = useProductsContext()
  const [titleRef, titleVisible] = useScrollReveal()
  const [gridRef, gridVisible] = useStaggerReveal({ threshold: 0.1 })
  const [limit, setLimit] = useState(8)

  const displayedProducts = useMemo(() => {
    return products.slice(0, limit)
  }, [products, limit])

  const hasMore = limit < products.length

  return (
    <section className={styles.section} aria-label="Todos os Produtos">
      <div
        ref={titleRef}
        className={`${styles.titleBlock} ${titleVisible ? styles.visible : styles.hidden}`}
      >
        <h2 className={styles.title}>Todos os nossos produtos</h2>
        <p className={styles.subtitle}>Confira a nossa coleção completa.</p>
      </div>

      <div ref={gridRef} className={styles.gridWrap}>
        <ProductGrid products={displayedProducts} staggerVisible={gridVisible} />
      </div>

      <div className={styles.actionBlock}>
        {hasMore ? (
          <button 
            onClick={() => setLimit(prev => prev + 8)} 
            className={styles.loadMoreBtn}
          >
            Carregar Mais Produtos
          </button>
        ) : (
          <Link to="/loja" className={styles.storeLink}>
            Ir para a loja →
          </Link>
        )}
      </div>
    </section>
  )
}
