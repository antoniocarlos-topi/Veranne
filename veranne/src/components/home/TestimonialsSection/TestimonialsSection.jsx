import React, { useMemo } from 'react'
import styles from './TestimonialsSection.module.css'
import { useScrollReveal } from '../../../hooks/useScrollReveal.js'
import { useStaggerReveal } from '../../../hooks/useStaggerReveal.js'

function Stars({ value }) {
  const rounded = Math.round(value || 5)
  return (
    <div className={styles.stars} aria-label={`${rounded} estrelas`}>
      {'★★★★★'.split('').map((_, i) => (
        <span key={i} className={i < rounded ? styles.starOn : styles.starOff}>
          ★
        </span>
      ))}
    </div>
  )
}

function Avatar({ name }) {
  const initial = (name || '?').trim()[0]?.toUpperCase() || '?'
  return (
    <div className={styles.avatar} aria-hidden="true">
      <span className={styles.avatarText}>{initial}</span>
    </div>
  )
}

export function TestimonialsSection() {
  const [titleRef, titleVisible] = useScrollReveal()
  const [gridRef, gridVisible] = useStaggerReveal()

  const testimonials = useMemo(
    () => [
      {
        name: 'Mariana S.',
        city: 'São Paulo',
        uf: 'SP',
        text:
          'Amei demais! O Colar Sérénité é ainda mais lindo pessoalmente. Qualidade impecável e chegou super rápido. Já quero comprar mais!',
      },
      {
        name: 'Camila R.',
        city: 'Belo Horizonte',
        uf: 'MG',
        text:
          'Comprei o Anel Aurora de promoção e me surpreendi com a qualidade. Parece muito mais caro do que é. VERANNE virou minha joalheria favorita.',
      },
      {
        name: 'Juliana M.',
        city: 'Fortaleza',
        uf: 'CE',
        text:
          'Presente perfeito! Comprei a Pulseira Belle para minha irmã e ela adorou. Embalagem linda, entrega rápida. Super recomendo!',
      },
    ],
    []
  )

  return (
    <section className={styles.section} aria-label="Depoimentos">
      <div className={styles.inner}>
        {/* Título com scroll reveal */}
        <div ref={titleRef} className={titleVisible ? styles.visible : styles.hidden}>
          <h2 className={styles.title}>O que nossas clientes dizem</h2>
          <div className={styles.subTitle}>Experiências reais com a VERANNE</div>
        </div>

        {/* Cards com stagger */}
        <div ref={gridRef} className={styles.grid}>
          {testimonials.map(t => (
            <article
              key={t.name}
              className={`${styles.card} staggerItem ${gridVisible ? 'visible' : 'hidden'}`}
            >
              <Stars value={5} />
              <p className={styles.text}>{t.text}</p>
              <div className={styles.meta}>
                <Avatar name={t.name} />
                <div className={styles.metaText}>
                  <div className={styles.metaName}>{t.name}</div>
                  <div className={styles.metaPlace}>
                    {t.city}, {t.uf}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
