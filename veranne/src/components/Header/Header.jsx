import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useConfig } from '../../context/ConfigContext.jsx'
import styles from './Header.module.css'
import logoMarca from '../../../image/logomarca.jpeg'
import { useProductsContext } from '../../context/ProductsContext.jsx'

function Icon({ children, className }) {
  return <span className={className}>{children}</span>
}

function Badge({ count }) {
  if (!count || count <= 0) return null
  return <span className={styles.badge}>{count}</span>
}

// ─── Dropdown de Usuário ─────────────────────────────────
function UserDropdown({ user, isAuthenticated, logout, onLoginClick }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Fechar com Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const firstName = user?.name ? user.name.split(' ')[0] : null

  return (
    <div className={styles.userWrap} ref={dropdownRef}>
      <button
        className={`${styles.iconBtn} ${styles.userBtn}`}
        aria-label="Minha conta"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        id="user-menu-btn"
        type="button"
      >
        <Icon className={styles.icon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Icon>
        {isAuthenticated && !user?.isGuest && (
          <span className={styles.userDot} aria-hidden="true" />
        )}
      </button>

      <div className={`${styles.userDropdown} ${open ? styles.userDropdownOpen : ''}`} role="menu">
        {isAuthenticated && user && !user.isGuest ? (
          // ─ Logado ─
          <>
            <div className={styles.userDropdownInfo}>
              <div className={styles.userDropdownName}>{firstName || user.name}</div>
              <div className={styles.userDropdownEmail}>{user.email}</div>
            </div>
            <div className={styles.userDropdownDivider} />
            <Link
              to="/minha-conta"
              className={styles.userDropdownItem}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/>
              </svg>
              Minha Conta
            </Link>
            <Link
              to="/favoritos"
              className={styles.userDropdownItem}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-4.534-9.5-8.5C.5 8.5 2.5 5.5 6 5.5c1.9 0 3.2 1 4 2 .8-1 2.1-2 4-2 3.5 0 5.5 3 3.5 7-2.5 3.966-9.5 8.5-9.5 8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
              </svg>
              Meus Favoritos
            </Link>
            <button
              className={`${styles.userDropdownItem} ${styles.userDropdownItemDisabled}`}
              disabled
              role="menuitem"
              aria-disabled="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M5 8h14M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8m-4 4v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Meus Pedidos
              <span className={styles.userDropdownBadge}>Em breve</span>
            </button>
            <div className={styles.userDropdownDivider} />
            <button
              className={`${styles.userDropdownItem} ${styles.userDropdownLogout}`}
              onClick={() => { setOpen(false); logout() }}
              role="menuitem"
              id="user-logout-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sair
            </button>
          </>
        ) : (
          // ─ Visitante / não logado ─
          <>
            <div className={styles.userDropdownInfo}>
              <div className={styles.userDropdownName}>Olá, Visitante</div>
            </div>
            <div className={styles.userDropdownDivider} />
            <button
              className={styles.userDropdownItem}
              onClick={() => { setOpen(false); onLoginClick() }}
              role="menuitem"
              id="user-login-link-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Fazer login
            </button>
            <Link
              to="/cadastro"
              className={styles.userDropdownItem}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7h4m0 0h4m-4 0V3m0 4v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/>
              </svg>
              Criar conta
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Header Principal ────────────────────────────────────
export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { items, totalItems } = useCart()
  const { totalFavorites } = useFavorites()
  const { user, isAuthenticated, logout } = useAuth()

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const { searchProducts } = useProductsContext()
  const { config } = useConfig()

  // Mobile search state
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const mobileSearchRef = useRef(null)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchProducts(searchQuery).slice(0, 5)
  }, [searchQuery, searchProducts])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (mobileSearchOpen) {
          setMobileSearchOpen(false)
          setSearchQuery('')
        }
        if (open) setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileSearchOpen, open])

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/loja', label: 'Loja' },
      { to: '/sobre', label: 'Sobre' },
      { to: '/contato', label: 'Contato' },
    ],
    []
  )

  function isActive(to) {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to
  }

  function handleMobileSearchOpen() {
    setMobileSearchOpen(true)
    setTimeout(() => {
      mobileSearchRef.current?.focus()
    }, 100)
  }

  // Ao clicar em "Fazer login" no dropdown → recarregar para resetar intro
  function handleLoginClick() {
    sessionStorage.removeItem('veranne_intro_seen')
    window.location.reload()
  }

  // Ao clicar em "Fazer login" no dropdown → recarregar para resetar intro
  function handleLoginClick() {
    sessionStorage.removeItem('veranne_intro_seen')
    window.location.reload()
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.hamburger}
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Logo com imagem */}
          <Link className={styles.logo} to="/" onClick={() => setOpen(false)} aria-label="VERANNE - Página inicial">
            <img src={logoMarca} alt="VERANNE" className={styles.logoImg} />
          </Link>

          <nav className={styles.nav} aria-label="Navegação principal">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`${styles.navLink} ${isActive(item.to) ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.icons} aria-label="Ações">
            {/* Busca */}
            <button 
              type="button"
              className={`${styles.iconBtn} ${styles.mobileSearchToggle}`} 
              aria-label="Buscar"
              onClick={handleMobileSearchOpen}
            >
              <Icon className={styles.icon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10.5 18.5C14.9183 18.5 18.5 14.9183 18.5 10.5C18.5 6.08172 14.9183 2.5 10.5 2.5C6.08172 2.5 2.5 6.08172 2.5 10.5C2.5 14.9183 6.08172 18.5 10.5 18.5Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M21.5 21.5L16.8 16.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Icon>
            </button>
            <Link to="/loja" className={`${styles.iconBtn} ${styles.desktopSearchToggle}`} aria-label="Buscar">
              <Icon className={styles.icon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10.5 18.5C14.9183 18.5 18.5 14.9183 18.5 10.5C18.5 6.08172 14.9183 2.5 10.5 2.5C6.08172 2.5 2.5 6.08172 2.5 10.5C2.5 14.9183 6.08172 18.5 10.5 18.5Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M21.5 21.5L16.8 16.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Icon>
            </Link>

            {/* Usuário com dropdown */}
            <UserDropdown
              user={user}
              isAuthenticated={isAuthenticated}
              logout={logout}
              onLoginClick={handleLoginClick}
            />

            {/* Favoritos */}
            <Link to="/favoritos" className={styles.iconBtn} aria-label="Favoritos">
              <Icon className={styles.icon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s-7-4.534-9.5-8.5C.5 8.5 2.5 5.5 6 5.5c1.9 0 3.2 1 4 2 0.8-1 2.1-2 4-2 3.5 0 5.5 3 3.5 7-2.5 3.966-9.5 8.5-9.5 8.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </Icon>
              <Badge count={totalFavorites} />
            </Link>

            <div
              className={styles.cartWrap}
              onMouseEnter={() => { if (window.innerWidth >= 768) setCartOpen(true) }}
              onMouseLeave={() => { if (window.innerWidth >= 768) setCartOpen(false) }}
            >
              <button 
                type="button" 
                className={styles.iconBtn} 
                aria-label="Carrinho"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setCartOpen(!cartOpen)
                  } else {
                    navigate('/carrinho')
                  }
                }}
              >
                <Icon className={styles.icon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 7h15l-1.5 14H8L6 7Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 7 5 3H2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11v0"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15 11v0"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </Icon>
                <Badge count={totalItems} />
              </button>

              <div className={`${styles.cartDropdown} ${cartOpen && totalItems > 0 ? styles.cartDropdownOpen : ''}`}>
                <div className={styles.cartDropdownHeader}>
                  <span className={styles.cartDropdownTitle}>Seu carrinho</span>
                  <span className={styles.cartDropdownCount}>{totalItems} item(ns)</span>
                </div>

                <div className={styles.cartDropdownBody}>
                  {items.slice(0, 3).map((it, idx) => (
                    <div key={idx} className={styles.cartLine}>
                      <div className={styles.cartThumb} aria-hidden="true">
                        {it?.product?.images?.[0] ? (
                          <img src={it.product.images[0]} alt="" />
                        ) : null}
                      </div>
                      <div className={styles.cartLineMeta}>
                        <div className={styles.cartLineName}>
                          {it?.product?.name || 'Produto'}
                        </div>
                        {it?.selectedSize ? (
                          <div className={styles.cartLineSub}>Tamanho: {it.selectedSize}</div>
                        ) : null}
                        <div className={styles.cartLineQty}>Qtd: {it.quantity}</div>
                      </div>
                    </div>
                  ))}

                  {items.length === 0 ? (
                    <div className={styles.cartEmpty}>Seu carrinho está vazio.</div>
                  ) : null}
                </div>

                <div className={styles.cartDropdownFooter}>
                  <button 
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/carrinho');
                    }} 
                    className={styles.cartGoBtn}
                  >
                    Ver carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frete grátis */}
      <div className={styles.freeBar} aria-label="Frete grátis">
        <div className="container">
          <div className={styles.freeBarInner}>
            <span className={styles.freeBarDot} aria-hidden="true" />
            <span className={styles.freeBarText}>
              Frete grátis acima de{' '}
              {config?.freeShippingAbove != null
                ? `R$ ${config.freeShippingAbove.toFixed(2).replace('.', ',')}`
                : '—'}
            </span>
            <span className={styles.freeBarTextStrong} aria-hidden="true">
              ✓
            </span>
          </div>
        </div>
      </div>

      {/* Barra de busca mobile */}
      <div className={`${styles.mobileSearchBar} ${mobileSearchOpen ? styles.open : ''}`}>
        <input
          ref={mobileSearchRef}
          className={styles.mobileSearchInput}
          placeholder="O que você procura?"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button 
          className={styles.mobileSearchClose}
          onClick={() => {
            setMobileSearchOpen(false)
            setSearchQuery('')
          }}
        >
          ✕
        </button>
      </div>

      {/* Resultados da busca mobile */}
      {mobileSearchOpen && searchResults.length > 0 && (
        <div className={styles.mobileSearchResults}>
          {searchResults.map(prod => (
            <div 
              key={prod.id} 
              className={styles.searchResultItem}
              onClick={() => {
                setMobileSearchOpen(false)
                setSearchQuery('')
                navigate(`/produto/${prod.slug}`)
              }}
            >
              <img src={prod.images[0]} alt={prod.name} className={styles.searchResultImg} />
              <div>
                <div className={styles.searchResultName}>{prod.name}</div>
                <div className={styles.searchResultPrice}>
                  R$ {prod.price.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer mobile */}
      {open ? <div className={styles.overlay} onClick={() => setOpen(false)} /> : null}
      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <img src={logoMarca} alt="VERANNE" className={styles.drawerLogoImg} />
          <button className={styles.drawerClose} type="button" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className={styles.drawerLinks}>
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`${styles.drawerLink} ${isActive(item.to) ? styles.drawerActive : ''}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className={styles.drawerSpacer} />
          <Link
            to="/favoritos"
            className={styles.drawerLink}
            onClick={() => setOpen(false)}
          >
            Favoritos {totalFavorites > 0 ? `(${totalFavorites})` : ''}
          </Link>
          <Link
            to="/carrinho"
            className={styles.drawerLink}
            onClick={() => setOpen(false)}
          >
            Carrinho {totalItems > 0 ? `(${totalItems})` : ''}
          </Link>
          <Link
            to={isAuthenticated ? '/minha-conta' : '/login'}
            className={styles.drawerLink}
            onClick={() => setOpen(false)}
          >
            Minha Conta
          </Link>
        </div>
      </aside>
    </header>
  )
}
