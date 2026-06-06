import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './AdminSidebar.module.css'
import logoTipo from '../../../../../image/logotipo.jpeg'

const menuItems = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/produtos', icon: '📦', label: 'Produtos' },
  { path: '/admin/homepage', icon: '🏠', label: 'Homepage' },
  { path: '/admin/promocoes', icon: '🏷️', label: 'Promoções' },
  { path: '/admin/cupons', icon: '🎟️', label: 'Cupons' },
  { path: '/admin/configuracoes', icon: '⚙️', label: 'Configurações' },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(path) {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  function handleLogout() {
    localStorage.removeItem('veranne_admin')
    navigate('/admin')
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} onClick={onClose} aria-hidden="true" />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`} aria-label="Menu lateral">
        <div className={styles.brand}>
          <img src={logoTipo} alt="VERANNE" className={styles.brandLogoImg} />
          <div className={styles.brandSub}>Admin Panel</div>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <nav className={styles.menu} aria-label="Menu principal">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={onClose}
            >
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            <span className={styles.icon} aria-hidden="true">🚪</span>
            <span className={styles.label}>Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}