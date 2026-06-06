import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx'
import styles from './Favorites.module.css'

function HeartIcon() {
  return (
    <svg viewBox="0 0 64 64" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M32 55s-20-12-26-24C1 18 8 9 18 9c6 0 11 3 14 8 3-5 8-8 14-8 10 0 17 9 12 22-6 12-26 24-26 24Z" />
    </svg>
  )
}

export default function Favorites() {
  const navigate = useNavigate()
  const { favorites, totalFavorites } = useFavorites()

  const hasFavorites = useMemo(() => totalFavorites > 0, [totalFavorites])

  return (
    <Layout>
      <div className={styles.wrap}>
        {!hasFavorites ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <HeartIcon />
            </div>

            <h1 className={styles.emptyTitle}>Nenhum favorito ainda</h1>
            <p className={styles.emptyText}>
              Salve as peças que você amou para encontrar facilmente depois.
            </p>

            <button type="button" className={styles.primaryBtn} onClick={() => navigate('/loja')}>
              Explorar Coleção
            </button>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                Meus Favoritos ({totalFavorites})
              </h1>
            </div>

            <ProductGrid products={favorites} emptyMessage="Nenhum favorito ainda." />

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.continueBtn}
                onClick={() => navigate('/loja')}
              >
                Continuar Explorando
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
