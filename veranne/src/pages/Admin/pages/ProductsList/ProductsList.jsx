import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductsContext } from '../../../../context/ProductsContext'
import Toast from '../../../../components/ui/Toast/Toast'
import styles from './ProductsList.module.css'

function formatBRL(value) {
  const n = Number(value || 0)
  return n.toFixed(2).replace('.', ',')
}

const CATEGORIES = [
  { value: '', label: 'Todas' },
  { value: 'aneis', label: 'Anéis' },
  { value: 'colares', label: 'Colares' },
  { value: 'pulseiras', label: 'Pulseiras' },
  { value: 'brincos', label: 'Brincos' },
  { value: 'conjuntos', label: 'Conjuntos' },
]

export default function ProductsList() {
  const navigate = useNavigate()
  const { products, toggleStock, toggleFeatured, deleteProduct } = useProductsContext()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '' })

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchesSearch = s
        ? String(p?.name || '').toLowerCase().includes(s)
        : true
      const matchesCategory = category ? p?.category === category : true
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  function handleDelete(id, name) {
    setDeleteConfirm({ id, name })
  }

  function confirmDelete() {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id)
      setDeleteConfirm(null)
      setToast({ show: true, message: '✅ Produto excluído!' })
      setTimeout(() => setToast({ show: false, message: '' }), 3000)
    }
  }

  function handleToggleStock(id) {
    toggleStock(id)
    setToast({ show: true, message: '✅ Estoque atualizado!' })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  function handleToggleFeatured(id) {
    toggleFeatured(id)
    setToast({ show: true, message: '✅ Destaque atualizado!' })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <h1 className={styles.h1}>Produtos ({products.length})</h1>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => navigate('/admin/produtos/novo')}
        >
          + Novo Produto
        </button>
      </div>

      <div className={styles.filters}>
        <input
          className={styles.input}
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tableWrap}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyText}>
              {search || category
                ? 'Nenhum produto encontrado com esses filtros.'
                : 'Nenhum produto cadastrado ainda.'}
            </p>
            {!search && !category && (
              <button
                type="button"
                className={styles.emptyBtn}
                onClick={() => navigate('/admin/produtos/novo')}
              >
                Cadastrar Produto
              </button>
            )}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Destaque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      className={styles.thumb}
                      alt={p.name}
                      src={p.images?.[0] || ''}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </td>
                  <td className={styles.nameCell}>{p.name}</td>
                  <td>{p.category || '—'}</td>
                  <td>
                    {p.originalPrice ? (
                      <>
                        <span className={styles.oldPrice}>
                          R$ {formatBRL(p.originalPrice)}
                        </span>
                        <br />
                        <span className={styles.price}>
                          R$ {formatBRL(p.price)}
                        </span>
                      </>
                    ) : (
                      `R$ ${formatBRL(p.price)}`
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.badgeBtn} ${p.inStock ? styles.badgeOn : styles.badgeOff}`}
                      onClick={() => handleToggleStock(p.id)}
                    >
                      {p.inStock ? '✅ Em estoque' : '❌ Esgotado'}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.badgeBtn} ${p.featured ? styles.badgeOn : styles.badgeOff}`}
                      onClick={() => handleToggleFeatured(p.id)}
                    >
                      {p.featured ? '⭐ Destaque' : '— Normal'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => navigate(`/admin/produtos/editar/${p.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Excluir Produto</h3>
            <p className={styles.modalText}>
              Tem certeza que deseja excluir <strong>"{deleteConfirm.name}"</strong>?
            </p>
            <p className={styles.modalWarning}>Esta ação não pode ser desfeita.</p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancel}
                onClick={() => setDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.modalDelete}
                onClick={confirmDelete}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast.message} visible={toast.show} />
    </div>
  )
}