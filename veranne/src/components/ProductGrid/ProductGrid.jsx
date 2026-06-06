import React from 'react'
import styles from './ProductGrid.module.css'

import ProductCard from '../ProductCard/ProductCard.jsx'

export default function ProductGrid({
  products = [],
  loading = false,
  emptyMessage = 'Nenhum produto encontrado.',
  viewMode = 'grid',
  staggerVisible,
}) {
  if (loading) {
    return (
      <div className={viewMode === 'list' ? styles.list : styles.grid} aria-label="Loading products">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLineSm} />
            <div className={styles.skeletonBtn} />
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  // Se staggerVisible foi passado, usar stagger bidirecional
  // Se não, usar fade-in simples (comportamento original)
  const useStagger = staggerVisible !== undefined

  return (
    <div className={viewMode === 'list' ? styles.list : styles.grid}>
      {products.map((p, i) => (
        <div
          key={p.id}
          className={
            useStagger
              ? `staggerItem ${staggerVisible ? 'visible' : 'hidden'}`
              : 'fade-in'
          }
          style={useStagger ? undefined : { animationDelay: `${i * 75}ms` }}
        >
          <ProductCard product={p} viewMode={viewMode} />
        </div>
      ))}
    </div>
  )
}

