import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCoupons } from '../../../../context/CouponsContext.jsx'
import { useProductsContext } from '../../../../context/ProductsContext'
import Toast from '../../../../components/ui/Toast/Toast'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { coupons } = useCoupons()
  const { products } = useProductsContext()
  const [showToast, setShowToast] = useState(false)

  const stats = useMemo(() => {
    const totalProducts = products.length
    const promoCount = products.filter(
      (p) => p?.originalPrice && Number(p?.price) < Number(p?.originalPrice)
    ).length
    const featuredCount = products.filter((p) => Boolean(p?.featured)).length
    const activeCoupons = coupons.filter((c) => c?.active).length
    return { totalProducts, promoCount, featuredCount, activeCoupons }
  }, [products, coupons])

  const recentProducts = useMemo(() => {
    return [...products].slice(-5).reverse()
  }, [products])

  function formatBRL(value) {
    const n = Number(value || 0)
    return n.toFixed(2).replace('.', ',')
  }

  return (
    <div className={styles.shell}>
      <h1 className={styles.h1}>Dashboard</h1>

      <div className={styles.cards}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalProducts}</div>
          <div className={styles.statLabel}>Total de Produtos</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.promoCount}</div>
          <div className={styles.statLabel}>Em Promoção</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.featuredCount}</div>
          <div className={styles.statLabel}>Em Destaque</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.activeCoupons}</div>
          <div className={styles.statLabel}>Cupons Ativos</div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <button
          type="button"
          className={styles.quickBtn}
          onClick={() => navigate('/admin/produtos/novo')}
        >
          + Novo Produto
        </button>

        <button
          type="button"
          className={styles.quickBtn}
          onClick={() => navigate('/admin/homepage')}
        >
          Editar Homepage
        </button>

        <button
          type="button"
          className={styles.quickBtn}
          onClick={() => navigate('/admin/promocoes')}
        >
          Criar Promoção
        </button>

        <button
          type="button"
          className={styles.quickBtn}
          onClick={() => navigate('/admin/cupons')}
        >
          Criar Cupom
        </button>
      </div>

      <h2 className={styles.sectionTitle}>Produtos Recentes</h2>

      <div className={styles.tableWrap}>
        {recentProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <p className={styles.emptyText}>Nenhum produto cadastrado ainda.</p>
            <button
              type="button"
              className={styles.emptyBtn}
              onClick={() => navigate('/admin/produtos/novo')}
            >
              Cadastrar Primeiro Produto
            </button>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      alt={p.name}
                      className={styles.thumb}
                      src={p.images?.[0] || ''}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </td>
                  <td className={styles.nameCell}>{p.name}</td>
                  <td>{p.category || '—'}</td>
                  <td>R$ {formatBRL(p.price)}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => navigate(`/admin/produtos/editar/${p.id}`)}
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

      <Toast message="✅ Alterações salvas!" visible={showToast} />
    </div>
  )
}