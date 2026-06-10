import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import { useProductsContext } from '../../context/ProductsContext.jsx'
import { CATEGORIES } from '../../data/products.js'
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx'
import ShopSearch from '../../components/Search/ShopSearch.jsx'
import styles from './Shop.module.css'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { useStaggerReveal } from '../../hooks/useStaggerReveal.js'

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])

  return debounced
}

const SORTS = [
  { id: 'featured', label: 'Destaques' },
  { id: 'new', label: 'Novidades' },
  { id: 'price_asc', label: 'Menor preço' },
  { id: 'price_desc', label: 'Maior preço' },
  { id: 'rating', label: 'Melhores avaliações' },
]

function parseQuery(search) {
  const params = new URLSearchParams(search)
  return {
    q: params.get('q') || '',
    category: params.get('categoria') || 'todos',
    sort: params.get('sort') || 'featured',
    min: params.get('min') || '',
    max: params.get('max') || '',
  }
}

function stringifyQuery({ q, category, sort, min, max }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (category && category !== 'todos') params.set('categoria', category)
  if (sort && sort !== 'featured') params.set('sort', sort)
  if (min) params.set('min', min)
  if (max) params.set('max', max)
  return params.toString()
}

export default function Shop() {
  const location = useLocation()
  const navigate = useNavigate()
  const initial = useMemo(() => parseQuery(location.search), [location.search])
  const { getProductsByCategory, searchProducts } = useProductsContext()
  const [query, setQuery] = useState(initial.q)
  const [category, setCategory] = useState(initial.category)
  const [sort, setSort] = useState(initial.sort)
  const [minPrice, setMinPrice] = useState(initial.min)
  const [maxPrice, setMaxPrice] = useState(initial.max)
  const [viewMode, setViewMode] = useState('grid')

  const [headerRef, headerVisible] = useScrollReveal()
  const [gridRef, gridVisible] = useStaggerReveal({ threshold: 0.05 })

  useEffect(() => {
    const next = parseQuery(location.search)
    setQuery(next.q)
    setCategory(next.category)
    setSort(next.sort)
    setMinPrice(next.min)
    setMaxPrice(next.max)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const debouncedQuery = useDebouncedValue(query, 300)

  const base = useMemo(() => {
    const catProducts = getProductsByCategory(category)
    const baseList = debouncedQuery.trim() ? searchProducts(debouncedQuery) : catProducts
    const ids = new Set(catProducts.map(p => p.id))
    
    return baseList.filter(p => {
      if (!ids.has(p.id)) return false
      const min = parseFloat(minPrice)
      const max = parseFloat(maxPrice)
      if (!isNaN(min) && p.price < min) return false
      if (!isNaN(max) && p.price > max) return false
      return true
    })
  }, [category, debouncedQuery, minPrice, maxPrice, getProductsByCategory, searchProducts])

  const sorted = useMemo(() => {
    const arr = [...base]
    switch (sort) {
      case 'new':
        arr.sort((a, b) => Number(b.isNew) - Number(a.isNew) || (b.rating || 0) - (a.rating || 0))
        return arr
      case 'price_asc':
        arr.sort((a, b) => (a.price || 0) - (b.price || 0))
        return arr
      case 'price_desc':
        arr.sort((a, b) => (b.price || 0) - (a.price || 0))
        return arr
      case 'rating':
        arr.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        return arr
      case 'featured':
      default:
        arr.sort((a, b) => Number(b.featured) - Number(a.featured) || (b.rating || 0) - (a.rating || 0))
        return arr
    }
  }, [base, sort])

  const total = sorted.length

  function syncUrl(next) {
    const qs = stringifyQuery({
      q: next.q ?? query,
      category: next.category ?? category,
      sort: next.sort ?? sort,
      min: next.min ?? minPrice,
      max: next.max ?? maxPrice,
    })
    navigate(`/loja${qs ? `?${qs}` : ''}`, { replace: true })
  }

  function onChangeQuery(v) {
    setQuery(v)
    syncUrl({ q: v })
  }

  function onSelectCategory(cat) {
    setCategory(cat)
    syncUrl({ category: cat })
  }

  function onChangeSort(v) {
    setSort(v)
    syncUrl({ sort: v })
  }

  function applyPriceFilter() {
    syncUrl({ min: minPrice, max: maxPrice })
  }

  const loading = false

  return (
    <Layout>
      <section className={styles.wrap}>
        <header
          ref={headerRef}
          className={`${styles.header} ${headerVisible ? styles.visible : styles.hidden}`}
        >
          <h1 className={styles.title}>Loja</h1>
          <p className={styles.subtitle}>Feita para destacar você</p>

          <div className={styles.controls}>
            <div className={styles.searchWrap}>
              <label className={styles.label} htmlFor="shop-search">
                Buscar
              </label>
              <ShopSearch value={query} onChange={onChangeQuery} />
            </div>

            <div className={styles.row}>
              <div className={styles.filterWrap}>
                <div className={styles.label}>Categorias</div>
                <div className={styles.catRow}>
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.catBtn} ${category === c.slug ? styles.catActive : ''}`}
                      onClick={() => onSelectCategory(c.slug)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.sortWrap}>
                <div className={styles.label}>Preço</div>
                <div className={styles.priceFilter}>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice} 
                    onChange={e => setMinPrice(e.target.value)}
                    className={styles.priceInput}
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice} 
                    onChange={e => setMaxPrice(e.target.value)}
                    className={styles.priceInput}
                  />
                  <button onClick={applyPriceFilter} className={styles.priceBtn}>Filtrar</button>
                </div>
              </div>

              <div className={styles.sortWrap}>
                <div className={styles.label}>Ordenar</div>
                <select className={styles.select} value={sort} onChange={e => onChangeSort(e.target.value)}>
                  {SORTS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.viewToggle}>
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewActive : ''}`}
                  title="Modo Grade"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewActive : ''}`}
                  title="Modo Lista"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="4" width="18" height="4" rx="1"/>
                    <rect x="3" y="10" width="18" height="4" rx="1"/>
                    <rect x="3" y="16" width="18" height="4" rx="1"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.count}>
              <span className={styles.countStrong}>{total}</span> {total === 1 ? 'produto' : 'produtos'}
            </div>
          </div>
        </header>

        <div ref={gridRef}>
          <ProductGrid 
            products={sorted} 
            loading={loading} 
            emptyMessage="Nenhum produto para esses filtros." 
            viewMode={viewMode}
            staggerVisible={gridVisible} 
          />
        </div>
      </section>
    </Layout>
  )
}

