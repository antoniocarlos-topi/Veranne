import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import Badge from '../ui/Badge/Badge.jsx'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, viewMode = 'grid' }) {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()

  const favorite = useMemo(() => {
    return product?.id ? isFavorite(product.id) : false
  }, [product, isFavorite])

  // Clique no card → navega para página do produto
  function onCardClick() {
    if (!product?.slug) return
    navigate(`/produto/${product.slug}`)
  }

  // Clique no botão "Adicionar ao Carrinho" → também navega para o produto
  // (usuário escolhe tamanho e confirma lá)
  function onAddToCartClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!product?.slug) return
    navigate(`/produto/${product.slug}`)
  }

  // Favoritar NÃO navega — apenas alterna estado
  function onToggleFavorite(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!product) return
    toggleFavorite(product)
  }

  const badgeType =
    product?.inStock === false
      ? 'esgotado'
      : product?.tags?.includes('novo')
      ? 'novo'
      : product?.tags?.includes('promoção')
      ? 'promoção'
      : product?.tags?.includes('destaque')
      ? 'destaque'
      : null

  return (
    <div
      className={`${styles.card} ${product?.inStock === false ? styles.cardSoldOut : ''} ${viewMode === 'list' ? styles.cardList : ''}`}
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onCardClick()
      }}
      aria-label={product?.name || 'Produto'}
    >
      {/* Botão de favoritar — canto superior direito */}
      <div className={styles.topRow}>
        <button
          type="button"
          className={`${styles.favBtn} ${favorite ? styles.favActive : ''}`}
          onClick={onToggleFavorite}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <span className={styles.favIcon}>{favorite ? '♥' : '♡'}</span>
        </button>
      </div>

      {/* Imagem com hover overlay e botão que sobe de baixo */}
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={product?.images?.[0]}
          alt={product?.name || 'Produto'}
          loading="lazy"
        />
        {product?.images?.[1] && (
          <img
            className={styles.imageHover}
            src={product?.images[1]}
            alt={`${product?.name} (Hover)` || 'Produto'}
            loading="lazy"
          />
        )}
        {/* Overlay escuro suave no hover */}
        <div className={styles.hoverOverlay} aria-hidden="true" />

        {/* Overlay de esgotado */}
        {product?.inStock === false ? <div className={styles.overlay} /> : null}

        {badgeType ? (
          <div className={styles.badgeWrap}>
            <Badge type={badgeType} />
          </div>
        ) : null}

        {/* Botão que sobe de baixo da imagem no hover */}
        <button
          type="button"
          className={styles.addToCartBtn}
          onClick={onAddToCartClick}
          disabled={product?.inStock === false}
          aria-label={`Ver ${product?.name || 'produto'}`}
        >
          {product?.inStock === false ? 'Indisponível' : 'Adicionar ao Carrinho'}
          <span className={styles.addArrow} aria-hidden="true"> →</span>
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.name}>{product?.name}</div>

        <div className={styles.priceRow}>
          <span className={styles.price}>R$ {Number(product?.price || 0).toFixed(2).replace('.', ',')}</span>
        </div>

        {product?.originalPrice ? (
          <div className={styles.originalRow}>
            <span className={styles.original}>
              R$ {Number(product.originalPrice).toFixed(2).replace('.', ',')}
            </span>
            <span className={styles.installments}>
              {product.installments}x de{' '}
              {Number(product.originalPrice / (product.installments || 1)).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ) : (
          <div className={styles.installmentsOnly}>
            {product.installments}x de{' '}
            {Number(product?.price || 0).toFixed(2).replace('.', ',')}
            <span className={styles.installmentsSuffix}>
              /mês
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
