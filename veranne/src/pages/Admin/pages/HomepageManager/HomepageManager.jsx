import React, { useState, useEffect } from 'react'
import { useHomepage } from '../../../../context/HomepageContext.jsx'
import { useProductsContext } from '../../../../context/ProductsContext'
import Toast from '../../../../components/ui/Toast/Toast'
import styles from './HomepageManager.module.css'

export default function HomepageManager() {
  const { homepage, updateHomepage } = useHomepage()
  const { products } = useProductsContext()
  const [formData, setFormData] = useState({
    heroBannerUrl: homepage.heroBannerUrl || '',
    heroTitle: homepage.heroTitle || '',
    heroSubtitle: homepage.heroSubtitle || '',
    heroLabel: homepage.heroLabel || '',
    featuredIds: homepage.featuredIds || [],
    banner1: homepage.banner1 || { imageUrl: '', title: '', subtitle: '', link: '' },
    banner2: homepage.banner2 || { imageUrl: '', title: '', subtitle: '', link: '' },
  })

  const [toast, setToast] = useState({ show: false, message: '' })

  // Sync with homepage data
  useEffect(() => {
    setFormData({
      heroBannerUrl: homepage.heroBannerUrl || '',
      heroTitle: homepage.heroTitle || '',
      heroSubtitle: homepage.heroSubtitle || '',
      heroLabel: homepage.heroLabel || '',
      featuredIds: homepage.featuredIds || [],
      banner1: homepage.banner1 || { imageUrl: '', title: '', subtitle: '', link: '' },
      banner2: homepage.banner2 || { imageUrl: '', title: '', subtitle: '', link: '' },
    })
  }, [homepage])

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handleBannerChange(bannerKey, field, value) {
    setFormData((prev) => ({
      ...prev,
      [bannerKey]: { ...prev[bannerKey], [field]: value },
    }))
  }

  function toggleFeatured(productId) {
    setFormData((prev) => {
      const featuredIds = prev.featuredIds.includes(productId)
        ? prev.featuredIds.filter((id) => id !== productId)
        : [...prev.featuredIds, productId]
      return { ...prev, featuredIds }
    })
  }

  function handleSave() {
    updateHomepage(formData)
    setToast({ show: true, message: '✅ Homepage atualizada!' })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.h1}>Gerenciar Homepage</h1>
        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          Salvar Todas as Alterações
        </button>
      </div>

      {/* Banner Hero */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Banner Hero</h2>
        <div className={styles.formCard}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Label do Hero</label>
              <input
                className={styles.input}
                value={formData.heroLabel}
                onChange={(e) => handleChange('heroLabel', e.target.value)}
                placeholder="Ex: NOVA COLEÇÃO 2025"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Título Principal</label>
              <input
                className={styles.input}
                value={formData.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="Ex: Feita para destacar você"
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Subtítulo</label>
              <textarea
                className={styles.textarea}
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                rows={3}
                placeholder="Descrição curta da homepage..."
              />
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>URL da Imagem de Fundo</label>
              <input
                className={styles.input}
                value={formData.heroBannerUrl}
                onChange={(e) => handleChange('heroBannerUrl', e.target.value)}
                placeholder="https://exemplo.com/banner.jpg"
              />
              {formData.heroBannerUrl && (
                <div className={styles.previewLarge}>
                  <img
                    src={formData.heroBannerUrl}
                    alt="Preview do banner"
                    onError={(e) => {
                      e.currentTarget.src = ''
                      e.currentTarget.alt = 'URL inválida'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Produtos em Destaque
          <span className={styles.counter}>
            {formData.featuredIds.length} de 8 selecionados
          </span>
        </h2>
        <div className={styles.formCard}>
          <p className={styles.helpText}>
            Selecione até 8 produtos para aparecerem na seção de destaque da homepage.
          </p>

          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div
                key={product.id}
                className={`${styles.productCard} ${formData.featuredIds.includes(product.id) ? styles.selected : ''}`}
                onClick={() => toggleFeatured(product.id)}
              >
                <div className={styles.productThumb}>
                  <img
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = ''
                      e.currentTarget.alt = 'Sem imagem'
                    }}
                  />
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.productCategory}>{product.category}</span>
                </div>
                <div className={styles.checkbox}>
                  {formData.featuredIds.includes(product.id) ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banners de Coleção */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Banners de Coleção</h2>

        {/* Banner 1 */}
        <div className={styles.bannerSection}>
          <h3 className={styles.bannerTitle}>Banner 1</h3>
          <div className={styles.formCard}>
            <div className={styles.bannerGrid}>
              <div className={styles.field}>
                <label className={styles.label}>URL da Imagem</label>
                <input
                  className={styles.input}
                  value={formData.banner1.imageUrl}
                  onChange={(e) => handleBannerChange('banner1', 'imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/banner1.jpg"
                />
                {formData.banner1.imageUrl && (
                  <div className={styles.previewSmall}>
                    <img
                      src={formData.banner1.imageUrl}
                      alt="Preview banner 1"
                      onError={(e) => {
                        e.currentTarget.src = ''
                        e.currentTarget.alt = 'URL inválida'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Título</label>
                <input
                  className={styles.input}
                  value={formData.banner1.title}
                  onChange={(e) => handleBannerChange('banner1', 'title', e.target.value)}
                  placeholder="Ex: Coleção Ouro"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Subtítulo</label>
                <input
                  className={styles.input}
                  value={formData.banner1.subtitle}
                  onChange={(e) => handleBannerChange('banner1', 'subtitle', e.target.value)}
                  placeholder="Ex: Brilhe com sofisticação"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Link de Destino</label>
                <input
                  className={styles.input}
                  value={formData.banner1.link}
                  onChange={(e) => handleBannerChange('banner1', 'link', e.target.value)}
                  placeholder="/loja?categoria=colares"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Banner 2 */}
        <div className={styles.bannerSection}>
          <h3 className={styles.bannerTitle}>Banner 2</h3>
          <div className={styles.formCard}>
            <div className={styles.bannerGrid}>
              <div className={styles.field}>
                <label className={styles.label}>URL da Imagem</label>
                <input
                  className={styles.input}
                  value={formData.banner2.imageUrl}
                  onChange={(e) => handleBannerChange('banner2', 'imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/banner2.jpg"
                />
                {formData.banner2.imageUrl && (
                  <div className={styles.previewSmall}>
                    <img
                      src={formData.banner2.imageUrl}
                      alt="Preview banner 2"
                      onError={(e) => {
                        e.currentTarget.src = ''
                        e.currentTarget.alt = 'URL inválida'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Título</label>
                <input
                  className={styles.input}
                  value={formData.banner2.title}
                  onChange={(e) => handleBannerChange('banner2', 'title', e.target.value)}
                  placeholder="Ex: Coleção Prata"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Subtítulo</label>
                <input
                  className={styles.input}
                  value={formData.banner2.subtitle}
                  onChange={(e) => handleBannerChange('banner2', 'subtitle', e.target.value)}
                  placeholder="Ex: Elegância atemporal"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Link de Destino</label>
                <input
                  className={styles.input}
                  value={formData.banner2.link}
                  onChange={(e) => handleBannerChange('banner2', 'link', e.target.value)}
                  placeholder="/loja?categoria=pulseiras"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Toast message={toast.message} visible={toast.show} />
    </div>
  )
}