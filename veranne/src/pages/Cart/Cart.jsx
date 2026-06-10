import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import { useConfig } from '../../context/ConfigContext.jsx'
import { useCoupons } from '../../context/CouponsContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import styles from './Cart.module.css'

function formatBRL(value) {
  const n = Number(value || 0)
  return n.toFixed(2).replace('.', ',')
}

function CartIcon() {
  return (
    <svg viewBox="0 0 64 64" width="54" height="54" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 18h42l-6 28H18l-6-28Z" />
      <path d="M18 18l-2-8h-6" />
      <path d="M24 46a2.5 2.5 0 1 0 0 .01Z" />
      <path d="M44 46a2.5 2.5 0 1 0 0 .01Z" />
    </svg>
  )
}

export default function Cart() {
  const navigate = useNavigate()
  const { 
    items,
    appliedCoupon, 
    setAppliedCoupon,
    clearCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart()
  const { validateCoupon, useCoupon } = useCoupons()
  const { config } = useConfig()
  
  const [toast, setToast] = useState(null)
  
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code || '')
  const [couponError, setCouponError] = useState('')

  const localSubtotal = items.reduce((acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 1)), 0)

  // Re-validate coupon when subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      const result = validateCoupon(appliedCoupon.code, localSubtotal)
      if (!result.valid) {
        setAppliedCoupon(null)
        setCouponError(`O cupom ${appliedCoupon.code} foi removido: ${result.message}`)
      }
    }
  }, [localSubtotal, appliedCoupon, validateCoupon, setAppliedCoupon])

  const localDiscount = appliedCoupon ? (() => {
    const val = Number(appliedCoupon.value || 0)
    if (appliedCoupon.type === 'percent') {
      return localSubtotal * (val / 100)
    }
    return Math.min(val, localSubtotal)
  })() : 0
  
  const localTotal = Math.max(0, localSubtotal - localDiscount)

  function handleApplyCoupon() {
    setCouponError('')
    if (!couponCode.trim()) {
      setAppliedCoupon(null)
      return
    }
    const result = validateCoupon(couponCode, localSubtotal)
    if (!result.valid) {
      setCouponError(result.message)
      setAppliedCoupon(null)
      return
    }
    setAppliedCoupon(result.coupon)
  }

  const computed = useMemo(() => {
    const totalItems = items.reduce((sum, it) => sum + (it.quantity || 0), 0)
    const remaining = Math.max(0, config.freeShippingAbove - localSubtotal)
    const progress = config.freeShippingAbove <= 0 ? 1 : Math.min(1, localSubtotal / config.freeShippingAbove)

    return {
      totalItems,
      remaining,
      progress,
      qualifiesFreeShipping: localSubtotal >= config.freeShippingAbove,
    }
  }, [items, localSubtotal, config.freeShippingAbove])

  const whatsappMessage = useMemo(() => {
    const safeItems = items || []
    const itemsList = safeItems.map(item => {
      const itemPrice = Number(item.product?.price || 0)
      const qty = Number(item.quantity || 1)
      const lineTotal = itemPrice * qty
      return `• ${item.product?.name || 'Produto'}` +
        (item.selectedSize ? ` | Tamanho: ${item.selectedSize}` : '') +
        (item.selectedColor ? ` | Cor: ${item.selectedColor.name}` : '') +
        ` | Qtd: ${qty}` +
        ` | R$ ${lineTotal.toFixed(2).replace('.', ',')}`
    }).join('\n')

    const subtotalLine = `Subtotal: R$ ${localSubtotal.toFixed(2).replace('.', ',')}`
    
    const discountLine = localDiscount > 0
      ? `Desconto (${appliedCoupon?.code}): -R$ ${localDiscount.toFixed(2).replace('.', ',')}`
      : ''

    const message =
      `Olá! Gostaria de finalizar meu pedido na Veranne:\n\n` +
      `${itemsList}\n\n` +
      `${subtotalLine}\n` +
      (discountLine ? `${discountLine}\n` : '') +
      `Total a pagar: R$ ${localTotal.toFixed(2).replace('.', ',')}\n\n` +
      `Aguardo instruções para pagamento via Pix. Obrigada!`

    return message
  }, [items, localSubtotal, localTotal, appliedCoupon, localDiscount])

  function onWhatsApp() {
    if (appliedCoupon) {
      useCoupon(appliedCoupon.id)
    }
    const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    setToast('Redirecionando para o WhatsApp...')
    window.setTimeout(() => setToast(null), 2000)
  }

  return (
    <Layout>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <h1 className={styles.title}>Carrinho</h1>
          {computed.totalItems > 0 ? (
            <div className={styles.itemsCount}>{computed.totalItems} item{computed.totalItems === 1 ? '' : 's'}</div>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <CartIcon />
            </div>
            <h2 className={styles.emptyTitle}>Seu carrinho está vazio</h2>
            <p className={styles.emptyText}>
              Explore nossa coleção e encontre a peça perfeita para você.
            </p>

            <button type="button" className={styles.primaryBtn} onClick={() => navigate('/loja')}>
              Explorar Coleção
            </button>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.itemsCol}>
              <div className={styles.itemsList} aria-label="Itens no carrinho">
                {items.map(it => {
                  const product = it.product || {}
                  const pid = product?.id
                  const size = it.selectedSize
                  const qty = it.quantity || 1
                  const unit = Number(product.price || 0)
                  const lineTotal = unit * qty

                  return (
                    <div key={`${pid}-${size}-${it.selectedColor?.name || 'none'}`} className={styles.item}>
                      <div className={styles.itemImage}>
                        {(() => {
                          const imgSrc = product?.images?.[0] || product?.image || null
                          return imgSrc ? (
                            <img 
                              src={imgSrc} 
                              alt={product.name || 'Produto'} 
                              onError={e => { e.target.style.display = 'none' }} 
                            />
                          ) : (
                            <div className={styles.itemImagePlaceholder} aria-hidden="true" />
                          )
                        })()}
                      </div>

                      <div className={styles.itemBody}>
                        <div className={styles.itemName}>{product.name || 'Produto'}</div>
                        <div className={styles.itemMeta}>
                          <span className={styles.metaStrong}>Tamanho:</span> {size || 'Não especificado'}
                        </div>
                        {it.selectedColor && (
                          <div className={styles.itemMeta}>
                            <span className={styles.metaStrong}>Cor:</span> {it.selectedColor.name}
                          </div>
                        )}
                        <div className={styles.itemMeta}>
                          <span className={styles.metaStrong}>Material:</span> {product.material || 'Aço Inox'}
                        </div>

                        <div className={styles.itemBottom}>
                          <div className={styles.itemPrice}>
                            R$ {formatBRL(lineTotal)}
                          </div>

                          <div className={styles.qtyWrap} aria-label="Controle de quantidade">
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              disabled={qty <= 1}
                              onClick={() => updateQuantity(pid, size, it.selectedColor, qty - 1)}
                              aria-label="Diminuir quantidade"
                            >
                              −
                            </button>

                            <div className={styles.qtyVal} aria-live="polite">
                              {qty}
                            </div>

                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() => updateQuantity(pid, size, it.selectedColor, qty + 1)}
                              aria-label="Aumentar quantidade"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => removeFromCart(pid, size, it.selectedColor)}
                            aria-label="Remover item"
                          >
                            <span className={styles.trashIcon} aria-hidden="true">
                              🗑
                            </span>
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <aside className={styles.summaryCol}>
              <div className={styles.summaryCard} aria-label="Resumo do pedido">
                <div className={styles.summaryTitle}>Resumo do Pedido</div>

                <div className={styles.summaryRow}>
                  <div className={styles.summaryLabel}>Subtotal ({computed.totalItems} itens)</div>
                  <div className={styles.summaryValue}>R$ {formatBRL(localSubtotal)}</div>
                </div>

                <div className={styles.shipping}>
                  {computed.qualifiesFreeShipping ? (
                    <div className={styles.freeShipping}>Frete Grátis 🎉</div>
                  ) : (
                    <div className={styles.shippingCalc}>
                      <div className={styles.shippingText}>
                        Falta R$ {formatBRL(computed.remaining)} para frete grátis
                      </div>
                      <div className={styles.progressBar} aria-hidden="true">
                        <div
                          className={styles.progressFill}
                          style={{ width: `${computed.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className={styles.shippingLine}>
                    <span className={styles.shippingLabel}>Entrega</span>
                    <span className={styles.shippingValue}>A calcular</span>
                  </div>
                </div>

                <div className={styles.divider} />

                {/* Cupom */}
                <div className={styles.couponWrap}>
                  <div className={styles.couponInputGroup}>
                    <input
                      type="text"
                      className={styles.couponInput}
                      placeholder="Código do cupom"
                      value={couponCode}
                      onChange={e => {
                        setCouponCode(e.target.value)
                        setCouponError('')
                      }}
                    />
                    <button type="button" className={styles.couponBtn} onClick={handleApplyCoupon}>
                      Aplicar
                    </button>
                  </div>
                  {couponError && <div className={styles.couponError}>{couponError}</div>}
                  {appliedCoupon && (
                    <div className={styles.couponSuccess}>
                      Cupom {appliedCoupon.code} aplicado! (-R$ {formatBRL(localDiscount)})
                    </div>
                  )}
                </div>

                <div className={styles.divider} />

                <div className={styles.totalRow}>
                  <div className={styles.totalLabel}>Total</div>
                  <div className={styles.totalValue}>R$ {formatBRL(localTotal)}</div>
                </div>

                <button type="button" className={styles.whatsBtn} onClick={onWhatsApp}>
                  <span className={styles.whatsIcon} aria-hidden="true">
                    ⟨
                  </span>
                  Finalizar via WhatsApp
                </button>

                <button type="button" className={styles.continueBtn} onClick={() => navigate('/loja')}>
                  Continuar Comprando <span className={styles.arrow}>→</span>
                </button>

                <div className={styles.features}>
                  <div className={styles.featureLine}>✓ Pagamento via Pix</div>
                  <div className={styles.featureLine}>✓ Entrega para todo BR</div>
                  <div className={styles.featureLine}>✓ Garantia de 1 ano</div>
                </div>

                {toast ? <div className={styles.toast}>{toast}</div> : null}

                {/* MVP: não limpar carrinho automaticamente */}
                <button type="button" className={styles.clearBtn} onClick={clearCart}>
                  Limpar carrinho
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  )
}
