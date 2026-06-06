import React from 'react'
import { useLocation } from 'react-router-dom'
import styles from './AdminHeader.module.css'

const routeTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/produtos': 'Produtos',
  '/admin/produtos/novo': 'Novo Produto',
  '/admin/homepage': 'Homepage',
  '/admin/promocoes': 'Promoções',
  '/admin/cupons': 'Cupons',
  '/admin/configuracoes': 'Configurações',
}

export default function AdminHeader({ onMenuClick }) {
  const location = useLocation()

  // Handle edit routes like /admin/produtos/editar/:id
  const getTitle = () => {
    const path = location.pathname

    if (path.startsWith('/admin/produtos/editar/')) {
      return 'Editar Produto'
    }

    return routeTitles[path] || 'Painel'
  }

  const title = getTitle()

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          ☰
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.right}>
        <a
          className={styles.viewStore}
          href="/"
          target="_blank"
          rel="noreferrer"
        >
          Ver Loja <span aria-hidden="true">↗</span>
        </a>

        <div className={styles.avatar} aria-label="Avatar do administrador">
          A
        </div>
      </div>
    </header>
  )
}