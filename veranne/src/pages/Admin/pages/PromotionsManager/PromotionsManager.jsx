import React, { useState, useMemo } from 'react'
import { useProductsContext } from '../../../../context/ProductsContext'
import Toast from '../../../../components/ui/Toast/Toast'
import styles from './PromotionsManager.module.css'

function formatBRL(value) {
  const n = Number(value || 0)
  return n.toFixed(2).replace('.', ',')
}

export default function PromotionsManager() {
  const { products, updateProduct } = useProductsContext()
  const [selectedProductId, setSelectedProductId] = useState('')
  const [promoPrice, setPromoPrice] = useState('')
  const [toast, setToast] = useState({ show: false, message: '' })

  // Products with active promotions
  const productsWithPromo = useMemo(() => {
    return products.filter(
      (p) => p.originalPrice && Number(p.price) < Number(p.originalPrice)
    )
  }, [products])

  // Products without promotions (for the select)
  const productsWithoutPromo = useMemo(() => {
    return products.filter(
      (p) => !p.originalPrice || Number(p.price) >= Number(p.originalPrice)
    )
  }, [products])

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId)
  }, [products, selectedProductId])

  const discountPercent = useMemo(() => {
    if (!selectedProduct || !promoPrice) return 0
    const original = Number(selectedProduct.price)
    const promo = Number(promoPrice)
    if (original <= 0 || promo >= original) return 0
    return Math.round(((original - promo) / original) * 100)
  }, [selectedProduct, promoPrice])

  function handleApplyPromo() {
    if (!selectedProductId || !promoPrice) {
      setToast({ show: true, message: '⚠️ Preencha todos os campos.' })
      setTimeout(() => setToast({ show: false, message: '' }), 3000)
      return
    }

    const promo = Number(promoPrice)
    const original = Number(selectedProduct.price)

    if (promo >= original) {
      setToast({ show: true, message: '⚠️ Preço promocional deve ser menor que o atual.' })
      setTimeout(() => setToast({ show: false, message: '' }), 3000)
      return
    }

    if (promo <= 0) {
      setToast({ show: true, message: '⚠️ Preço promocional deve ser maior que zero.' })
      setTimeout(() => setToast({ show: false, message: '' }), 3000)
      return
    }

    updateProduct(selectedProductId, {
      originalPrice: original,
      price: promo,
    })

    setToast({ show: true, message: '✅ Promoção aplicada!' })
    setSelectedProductId('')
    setPromoPrice('')
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  function handleRemovePromo(productId, productName) {
    if (!window.confirm(`Remover promoção de "${productName}"?`)) return

    const product = products.find((p) => p.id === productId)
    if (!product) return

    updateProduct(productId, {
      price: product.originalPrice,
      originalPrice: null,
    })

    setToast({ show: true, message: '✅ Promoção removida!' })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>Gerenciar Promoções</h1>

      {/* Promoções Ativas */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Promoções Ativas
          <span className={styles.badge}>{productsWithPromo.length}</span>
        </h2>

        <div className={styles.card}>
          {productsWithPromo.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🏷️</span>
              <p className={styles.emptyText}>Nenhuma promoção ativa no momento.</p>
            </div>
          ) : (
            <div className={styles.promoList}>
              {productsWithPromo.map((product) => (
                <div key={product.id} className={styles.promoItem}>
                  <div className={styles.promoThumb}>
                    <img
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = ''
                        e.currentTarget.alt = 'Sem imagem'
                      }}
                    />
                  </div>

                  <div className={styles.promoInfo}>
                    <span className={styles.promoName}>{product.name}</span>
                    <span className={styles.promoPrices}>
                      <span className={styles.oldPrice}>
                        De R$ {formatBRL(product.originalPrice)}
                      </span>
                      <span className={styles.newPrice}>
                        Por R$ {formatBRL(product.price)}
                      </span>
                      <span className={styles.discount}>
                        -{Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemovePromo(product.id, product.name)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Aplicar Nova Promoção */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Aplicar Nova Promoção</h2>

        <div className={styles.card}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Produto</label>
              <select
                className={styles.select}
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value)
                  setPromoPrice('')
                }}
              >
                <option value="">Selecione um produto...</option>
                {productsWithoutPromo.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — R$ {formatBRL(product.price)}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className={styles.field}>
                <label className={styles.label}>
                  Novo Preço Promocional
                  <div className={styles.inputGroup}>
                    <span className={styles.prefix}>R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className={styles.input}
                      value={promoPrice}
                      onChange={(e) => setPromoPrice(e.target.value)}
                      placeholder="0,00"
                    />
                  </div>
                </label>
              </div>
            )}
          </div>

          {selectedProduct && promoPrice && discountPercent > 0 && (
            <div className={styles.preview}>
              <span className={styles.previewLabel}>Preview:</span>
              <span className={styles.previewText}>
                De <strong>R$ {formatBRL(selectedProduct.price)}</strong> por{' '}
                <strong>R$ {formatBRL(promoPrice)}</strong> (
                <span className={styles.previewDiscount}>-{discountPercent}%</span>)
              </span>
            </div>
          )}

          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleApplyPromo}
            disabled={!selectedProductId || !promoPrice}
          >
            Aplicar Promoção
          </button>
        </div>
      </section>

      <Toast message={toast.message} visible={toast.show} />
    </div>
  )
}