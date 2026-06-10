import React from 'react'
import { Link } from 'react-router-dom'
import { useHomepage } from '../../../context/HomepageContext'
import { useScrollReveal } from '../../../hooks/useScrollReveal.js'
import styles from './CollectionBanner.module.css'

export function CollectionBanner() {
  const [refLeft, isVisibleLeft] = useScrollReveal()
  const [refRight, isVisibleRight] = useScrollReveal()
  const { homepage } = useHomepage()
  const { banner1, banner2 } = homepage

  const banners = [
    { data: banner1, ref: refLeft, visible: isVisibleLeft, hiddenClass: styles.hiddenLeft },
    { data: banner2, ref: refRight, visible: isVisibleRight, hiddenClass: styles.hiddenRight },
  ]

  return (
    <section className={styles.section} aria-label="Coleções em destaque">
      <div className={styles.grid}>
        {banners.map((item, index) => (
          <Link
            key={index}
            ref={item.ref}
            to={item.data.link || '/loja'}
            className={`${styles.banner} ${item.visible ? styles.visibleX : item.hiddenClass}`}
          >
            <div
              className={styles.bg}
              style={
                item.data?.imageUrl
                  ? { backgroundImage: `url(${item.data.imageUrl})` }
                  : { background: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)' }
              }
            />

            {/* Overlay */}
            <div className={styles.overlay} />

            {/* Conteúdo */}
            <div className={styles.content}>
              <span className={styles.kicker}>
                Coleção
              </span>
              <h3 className={styles.title}>
                {item.data.title}
              </h3>
              <p className={styles.subtitle}>
                {item.data.subtitle}
              </p>
              <span className={styles.link}>
                Explorar →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
