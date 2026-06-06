import React from 'react'
import styles from './BenefitsSection.module.css'
import { useStaggerReveal } from '../../../hooks/useStaggerReveal.js'

function Icon({ children, label }) {
  return (
    <div className={styles.iconWrap} aria-label={label} role="img">
      {children}
    </div>
  )
}

function DiamondStar() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M32 4 45 20l15 12-15 12L32 60 19 44 4 32 19 20 32 4Z" />
      <path d="M32 18l4.5 10.5L47 33l-10.5 4.5L32 48l-4.5-10.5L17 33l10.5-4.5L32 18Z" />
    </svg>
  )
}

function TruckBox() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 26h30v20H12z" />
      <path d="M42 26h8l4 6v14h-12z" />
      <path d="M14 46a4 4 0 1 0 0.01 0Z" />
      <path d="M48 46a4 4 0 1 0 0.01 0Z" />
      <path d="M18 34h10" />
      <path d="M30 34h10" />
    </svg>
  )
}

function ShieldHeart() {
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M32 6c10 6 18 6 18 6v18c0 14-10 24-18 28-8-4-18-14-18-28V12s8 0 18-6Z" />
      <path d="M24 30c0-4 4-7 8-3 4-4 8-1 8 3 0 10-8 14-8 14s-8-4-8-14Z" />
    </svg>
  )
}

const benefits = [
  {
    icon: <DiamondStar />,
    label: 'Qualidade premium',
    title: 'Qualidade Premium',
    text: 'Semijoias em aço inox 316L com banho de alta durabilidade. Peças que resistem ao tempo e mantêm o brilho.',
  },
  {
    icon: <TruckBox />,
    label: 'Entrega para todo o Brasil',
    title: 'Entrega para Todo o Brasil',
    text: 'Enviamos para qualquer cidade brasileira com rastreamento e embalagem especial para sua joia chegar perfeita.',
  },
  {
    icon: <ShieldHeart />,
    label: 'Satisfação garantida',
    title: 'Satisfação Garantida',
    text: 'Garantia de 1 ano contra defeitos de fabricação. Troca fácil e sem burocracia se necessário.',
  },
]

export function BenefitsSection() {
  const [ref, isVisible] = useStaggerReveal()

  return (
    <section className={styles.section} aria-label="Benefícios">
      <div className={styles.inner}>
        <div ref={ref} className={styles.grid}>
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className={`${styles.card} staggerItem ${isVisible ? 'visible' : 'hidden'}`}
            >
              <Icon label={b.label}>{b.icon}</Icon>
              <div className={styles.cardTitle}>{b.title}</div>
              <p className={styles.cardText}>{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
