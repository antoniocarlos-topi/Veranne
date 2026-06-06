import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminDashboard.module.css'

const PRODUCTS_KEY = 'veranne_products'

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  const products = useMemo(() => {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (!raw) return []
    const parsed = safeParse(raw, [])
    return Array.isArray(parsed) ? parsed : []
  }, [])

  const stats = useMemo(() => {
    const totalProducts = products.length
    const promoCount = products.filter(p => p?.originalPrice && Number(p?.price) < Number(p?.originalPrice)).length
    const featuredCount = products.filter(p => Boolean(p?.featured)).length
    const activeCoupons = 0 // cupons serão implementados na Fase 5 completa
    return { totalProducts, promoCount, featuredCount, activeCoupons }
  }, [products])

  function go(to) {
    navigate(to)
  }

  const recentProducts = useMemo(() => {
    return [...products].slice(-5).reverse()
  }, [products])

  return (
    <div className={styles.shell}>
      <section className={styles.content}>
        <h1 className={styles.h1}>Dashboard</h1>

        <div className={styles.cards}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total de Produtos</div>
            <div className={styles.statValue}>{stats.totalProducts}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Em Promoção</div>
            <div className={styles.statValue}>{stats.promoCount}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Em Destaque</div>
            <div className={styles.statValue}>{stats.featuredCount}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>Cupons Ativos</div>
            <div className={styles.statValue}>{stats.activeCoupons}</div>
          </div>
        </div>

        <div style={{ height: '1.25rem' }} />

        <div className={styles.quickActions}>
          <button
            type="button"
            className={styles.quickBtn}
            onClick={() => go('/admin/dashboard/produtos/novo')}
          >
            + Novo Produto
          </button>

          <button
            type="button"
            className={styles.quickBtn}
            onClick={() => go('/admin/dashboard/homepage')}
          >
            Editar Homepage
          </button>

          <button
            type="button"
            className={styles.quickBtn}
            onClick={() => go('/admin/dashboard/promocoes')}
          >
            Criar Promoção
          </button>

          <button
            type="button"
            className={styles.quickBtn}
            onClick={() => go('/admin/dashboard/cupons')}
          >
            Criar Cupom
          </button>
        </div>

        <div style={{ height: '2rem' }} />

        <h2 className={styles.sectionTitle}>Produtos Recentes</h2>

        <div className={styles.tableWrap}>
          {recentProducts.length === 0 ? (
            <div className={styles.emptyState}>Nenhum produto cadastrado ainda.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img
                        alt={p.name}
                        className={styles.thumb}
                        src={p.images?.[0] || ''}
                        onError={e => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category || '—'}</td>
                    <td>R$ {Number(p.price || 0).toFixed(2).replace('.', ',')}</td>
                    <td>{p.inStock ? '✅' : '❌'}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => go(`/admin/dashboard/produtos/editar/${p.id}`)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ height: '1rem' }} />
      </section>
    </div>
  )
}
