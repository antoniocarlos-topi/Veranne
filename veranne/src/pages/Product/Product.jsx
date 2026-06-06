import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/Layout/Layout.jsx'
import { useProductsContext } from '../../context/ProductsContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import Badge from '../../components/ui/Badge/Badge.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import { Confetti } from '../../components/ui/Confetti/Confetti.jsx'
import styles from './Product.module.css'
import { useConfig } from '../../context/ConfigContext.jsx'
import { useScrollReveal } from '../../hooks/useScrollReveal.js'
import { useStaggerReveal } from '../../hooks/useStaggerReveal.js'

function moneyBRL(n) {
  return `R$ ${Number(n || 0).toFixed(2).replace('.', ',')}`
}

function buildWhatsAppLink({ phone, text }) {
  const url = `https://wa.me/${phone}`
  return `${url}?text=${encodeURIComponent(text)}`
}

export default function Product() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { getProductBySlug, getRelatedProducts } = useProductsContext()

  const product = useMemo(() => getProductBySlug(slug), [slug, getProductBySlug])
  const { config } = useConfig()

  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [sizeError, setSizeError] = useState(false)
  const [colorError, setColorError] = useState(false)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const [isSizeGuideOpen, setSizeGuideOpen] = useState(false)
  
  const [showConfetti, setShowConfetti] = useState(false)
  const [showAddedToast, setShowAddedToast] = useState(false)

  const related = useMemo(() => {
    if (!product) return []
    return getRelatedProducts(product, 8)
  }, [product, getRelatedProducts])

  const [mainRef, mainVisible] = useScrollReveal()
  const [relatedRef, relatedVisible] = useStaggerReveal({ threshold: 0.1 })

  const images = product?.images || []
  const isSoldOut = product?.inStock === false

  useEffect(() => {
    // Reset selections on product change
    setSelectedSize(null)
    setSelectedColor(null)
    setSizeError(false)
    setColorError(false)
    setCurrentImageIndex(0)
  }, [product?.id])

  // Swipe logic
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  function handleTouchStart(e) {
    setTouchStart(e.targetTouches[0].clientX)
  }
  function handleTouchMove(e) {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  function handleTouchEnd() {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (Math.abs(distance) > 50) {
      if (distance > 0) nextImage()
      else prevImage()
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  function nextImage() {
    setCurrentImageIndex(prev => (prev + 1) % images.length)
  }

  function prevImage() {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  if (!product) {
    return (
      <Layout>
        <div className={styles.productPage}>
          <h1 className={styles.productName}>Produto não encontrado.</h1>
          <button className={styles.favoriteButton} type="button" onClick={() => navigate('/loja')}>
            Voltar para a Loja
          </button>
        </div>
      </Layout>
    )
  }

  const stockInfo = isSoldOut 
    ? 'Esgotado' 
    : (product.stock && product.stock < 5) 
      ? `Últimas ${product.stock} unidades!` 
      : 'Em estoque'

  function onAddToCart() {
    if (!product || isSoldOut) return

    let hasError = false
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 600)
      hasError = true
    }
    if (product.colors?.length > 0 && !selectedColor) {
      setColorError(true)
      setTimeout(() => setColorError(false), 600)
      hasError = true
    }

    if (hasError) return

    addToCart(product, selectedSize || null, selectedColor || null)
    
    setShowConfetti(true)
    setShowAddedToast(true)

    setTimeout(() => {
      setShowConfetti(false)
      setShowAddedToast(false)
    }, 2500)
  }

  const waText = 
    `Olá! Tenho interesse no produto:\n\n` +
    `*${product.name}*\n` +
    `Cor: ${selectedColor?.name || 'Não especificada'}\n` +
    `Tamanho: ${selectedSize || 'Não especificado'}\n` +
    `Valor: R$ ${product.price.toFixed(2).replace('.', ',')}\n\n` +
    `Gostaria de finalizar minha compra!`

  const whatsappLink = buildWhatsAppLink({ phone: config.whatsappNumber, text: waText })

  return (
    <Layout>
      {showConfetti && <Confetti active={true} />}
      {showAddedToast && (
        <div className={styles.addedToast}>
          <span className={styles.checkIcon}>✓</span>
          <span>Adicionado ao carrinho!</span>
        </div>
      )}

      <section className={styles.productPage}>
        <div
          ref={mainRef}
          className={`${styles.productGrid} ${mainVisible ? styles.visible : styles.hidden}`}
        >
          {/* Coluna 1: Carrossel */}
          <div className={styles.carouselCol}>
            <div 
              className={styles.imageWrapper}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                key={currentImageIndex} /* forca re-render p/ animacao */
                className={`${styles.mainImage} ${styles.entering}`} 
                src={images[currentImageIndex]} 
                alt={`${product.name} - Imagem ${currentImageIndex + 1}`} 
                onClick={() => setIsZoomOpen(true)}
              />
              
              {images.length > 1 && (
                <>
                  <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevImage}>‹</button>
                  <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextImage}>›</button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <>
                <div className={styles.thumbnails}>
                  {images.map((img, i) => (
                    <img 
                      key={i}
                      src={img} 
                      className={`${styles.thumb} ${currentImageIndex === i ? styles.activeThumb : ''}`}
                      onClick={() => setCurrentImageIndex(i)}
                      alt={`Thumb ${i}`}
                    />
                  ))}
                </div>
                <div className={styles.dots}>
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`${styles.dot} ${currentImageIndex === i ? styles.activeDot : ''}`}
                      onClick={() => setCurrentImageIndex(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Coluna 2: Info */}
          <div className={styles.infoCol}>
            <h1 className={styles.productName}>{product.name}</h1>
            
            <div className={styles.rating}>
              {'★★★★★'.split('').map((_, i) => (
                <span key={i} className={i < Math.round(product.rating || 0) ? styles.starOn : styles.starOff}>
                  ★
                </span>
              ))}
              <span className={styles.reviewCount}>({product.reviewCount || 0} avaliações)</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.priceBlock}>
              {product.originalPrice && (
                <span className={styles.originalPrice}>{moneyBRL(product.originalPrice)}</span>
              )}
              <span className={styles.price}>{moneyBRL(product.price)}</span>
            </div>
            
            <div className={styles.installments}>
              {product.installments}x de {moneyBRL((product.originalPrice || product.price) / (product.installments || 1)).replace('R$ ', 'R$ ')} s/ juros
            </div>

            <div className={styles.divider} />

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Material:</span> {product.material}
            </div>

            <div className={styles.divider} />

            {/* CORES */}
            {product.colors?.length > 0 && (
              <div className={`${styles.colorSelector} ${colorError ? styles.selectorError : ''}`}>
                <p className={styles.selectorLabel}>
                  Cor: <span className={styles.selectedValue}>{selectedColor?.name || 'Selecione'}</span>
                </p>
                <div className={styles.colorOptions}>
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      type="button"
                      className={`${styles.colorBtn} ${selectedColor?.name === color.name ? styles.colorBtnActive : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      aria-label={color.name}
                    >
                      <span className={styles.colorCircle} style={{ backgroundColor: color.hex }} />
                      <span className={styles.colorName}>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && <div className={styles.divider} />}

            {/* TAMANHOS */}
            {product.sizes?.length > 0 && (
              <div className={`${styles.sizeSelector} ${sizeError ? styles.selectorError : ''}`}>
                <div className={styles.sizesHeader}>
                  <p className={styles.selectorLabel}>
                    Tamanho: <span className={styles.selectedValue}>{selectedSize || 'Selecione'}</span>
                  </p>
                  <button type="button" className={styles.guideBtn} onClick={() => setSizeGuideOpen(true)}>
                    Guia de Medidas
                  </button>
                </div>
                <div className={styles.sizeGrid}>
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeActive : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && <div className={styles.divider} />}

            {/* BOTÕES */}
            <div className={styles.actions}>
              <button 
                type="button" 
                className={styles.addToCartButton} 
                onClick={onAddToCart} 
                disabled={isSoldOut}
              >
                {isSoldOut ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </button>

              <a className={styles.whatsappButton} href={whatsappLink} target="_blank" rel="noreferrer">
                Comprar via WhatsApp
              </a>
              
              <button type="button" className={styles.favoriteButton}>
                ♡ Favoritar
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.desc}>{product.description}</div>
            
            <div className={styles.features}>
              <div className={styles.featureLine}>✓ Pagamento via Pix e Cartão</div>
              <div className={styles.featureLine}>✓ Entrega para todo BR</div>
              <div className={styles.featureLine}>✓ Garantia de 1 ano</div>
            </div>
            
          </div>
        </div>

        {/* RELATED */}
        {related.length ? (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Você também vai amar</h2>
            {/* Desktop Grid */}
            <div ref={relatedRef} className={styles.relatedGrid}>
              {related.map(p => (
                <div 
                  key={p.id} 
                  className={`${styles.relatedItem} staggerItem ${relatedVisible ? 'visible' : 'hidden'} ${styles.cardSmall}`}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {isZoomOpen && (
          <div className={styles.zoomModal} onClick={() => setIsZoomOpen(false)}>
            <button className={styles.zoomClose} aria-label="Fechar zoom" onClick={() => setIsZoomOpen(false)}>✕</button>
            <img src={images[currentImageIndex]} alt={product.name} className={styles.zoomImg} onClick={e => e.stopPropagation()} />
          </div>
        )}

        {isSizeGuideOpen && (
          <div className={styles.modalOverlay} onClick={() => setSizeGuideOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={() => setSizeGuideOpen(false)}>✕</button>
              <h2 className={styles.modalTitle}>Guia de Medidas</h2>
              <div className={styles.modalBody}>
                <p>Meça a circunferência do seu dedo ou pulso para descobrir o tamanho ideal.</p>
                <table className={styles.sizeTable}>
                  <thead>
                    <tr><th>Tamanho</th><th>Medida (cm)</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>14</td><td>5,4 cm</td></tr>
                    <tr><td>16</td><td>5,6 cm</td></tr>
                    <tr><td>18</td><td>5,8 cm</td></tr>
                    <tr><td>20</td><td>6,0 cm</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}
