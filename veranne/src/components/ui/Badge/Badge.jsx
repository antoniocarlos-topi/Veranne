import React from 'react'
import styles from './Badge.module.css'

export default function Badge({ type = 'novo', children }) {
  const cls =
    type === 'promoção'
      ? styles.promo
      : type === 'destaque'
      ? styles.highlight
      : type === 'esgotado'
      ? styles.soldOut
      : styles.new

  return (
    <span className={`${styles.badge} ${cls}`}>
      {children || (type === 'promoção' ? 'Promoção' : type === 'destaque' ? 'Destaque' : type === 'esgotado' ? 'Esgotado' : 'Novo')}
    </span>
  )
}
