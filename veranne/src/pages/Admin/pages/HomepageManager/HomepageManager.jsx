import React, { useState, useEffect, useRef } from 'react'
import { useHomepage } from '../../../../context/HomepageContext.jsx'
import { useProductsContext } from '../../../../context/ProductsContext'
import { uploadBannerImage } from '../../../../services/supabase'
import Toast from '../../../../components/ui/Toast/Toast'
import styles from './HomepageManager.module.css'

export default function HomepageManager() {
  const { homepage, updateHomepage } = useHomepage()
  const { products } = useProductsContext()
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState({ show: false, message: '' })
  const [uploading, setUploading] = useState({})

  // Estados do formulário
  const [heroImages,    setHeroImages]    = useState(
    homepage.heroImages || [homepage.heroBannerUrl || '']
  )
  const [heroTitle,     setHeroTitle]     = useState(homepage.heroTitle || '')
  const [heroSubtitle,  setHeroSubtitle]  = useState(homepage.heroSubtitle || '')
  const [heroLabel,     setHeroLabel]     = useState(homepage.heroLabel || '')
  const [featuredIds,   setFeaturedIds]   = useState(homepage.featuredIds || [])
  const [banner1,       setBanner1]       = useState(
    homepage.banner1 || { imageUrl: '', title: '', subtitle: '', link: '' }
  )
  const [banner2,       setBanner2]       = useState(
    homepage.banner2 || { imageUrl: '', title: '', subtitle: '', link: '' }
  )
  const [whatsappLink,  setWhatsappLink]  = useState(homepage.whatsappLink || '')
  const [instagramLink, setInstagramLink] = useState(homepage.instagramLink || '')
  const [tiktokLink,    setTiktokLink]    = useState(homepage.tiktokLink || '')
  
  const [categories, setCategories] = useState(
    homepage.categories || {
      aneis: { imageUrl: '' },
      colares: { imageUrl: '' },
      pulseiras: { imageUrl: '' },
      brincos: { imageUrl: '' },
      conjuntos: { imageUrl: '' },
    }
  )

  // Sync with homepage data
  useEffect(() => {
    setHeroImages(homepage.heroImages || [homepage.heroBannerUrl || ''])
    setHeroTitle(homepage.heroTitle || '')
    setHeroSubtitle(homepage.heroSubtitle || '')
    setHeroLabel(homepage.heroLabel || '')
    setFeaturedIds(homepage.featuredIds || [])
    setBanner1(homepage.banner1 || { imageUrl: '', title: '', subtitle: '', link: '' })
    setBanner2(homepage.banner2 || { imageUrl: '', title: '', subtitle: '', link: '' })
    setWhatsappLink(homepage.whatsappLink || '')
    setInstagramLink(homepage.instagramLink || '')
    setTiktokLink(homepage.tiktokLink || '')
    setCategories(homepage.categories || {
      aneis: { imageUrl: '' },
      colares: { imageUrl: '' },
      pulseiras: { imageUrl: '' },
      brincos: { imageUrl: '' },
      conjuntos: { imageUrl: '' },
    })
  }, [homepage])

  // Upload de imagem genérico
  async function handleImageUpload(file, type, onSuccess) {
    if (!file) return
    setUploading(prev => ({ ...prev, [type]: true }))
    try {
      const url = await uploadBannerImage(file, type)
      onSuccess(url)
      showToast('✅ Imagem enviada com sucesso!')
    } catch (err) {
      showToast('❌ Erro ao enviar imagem: ' + err.message)
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  // ── HERO IMAGES ────────────────────────────────────────

  function addHeroImage() {
    if (heroImages.length >= 3) {
      showToast('Máximo de 3 imagens no carrossel.')
      return
    }
    setHeroImages(prev => [...prev, ''])
  }

  function removeHeroImage(index) {
    if (heroImages.length <= 1) return
    setHeroImages(prev => prev.filter((_, i) => i !== index))
  }

  function updateHeroImageUrl(index, url) {
    setHeroImages(prev =>
      prev.map((img, i) => i === index ? url : img)
    )
  }

  // ── PRODUTOS EM DESTAQUE ───────────────────────────────

  function toggleFeatured(productId) {
    setFeaturedIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId)
      }
      if (prev.length >= 8) return prev
      return [...prev, productId]
    })
  }

  // ── SALVAR TUDO ────────────────────────────────────────

  async function handleSave() {
    setSaving(true)
    try {
      await updateHomepage({
        heroImages:    heroImages.filter(Boolean),
        heroTitle,
        heroSubtitle,
        heroLabel,
        featuredIds,
        banner1,
        banner2,
        categories,
        whatsappLink,
        instagramLink,
        tiktokLink,
      })
      showToast('✅ Homepage atualizada com sucesso!')
    } catch {
      showToast('❌ Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  function showToast(msg) {
    setToast({ show: true, message: msg })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.h1}>Gerenciar Homepage</h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={styles.saveBtn}
        >
          {saving ? 'Salvando...' : 'Salvar Todas as Alterações'}
        </button>
      </div>

      {/* ── SEÇÃO 1: CARROSSEL HERO ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🖼️ Carrossel Principal (Hero)
        </h2>
        <div className={styles.formCard}>
          <p className={styles.helpText}>
            Adicione até 3 imagens que vão aparecer no banner
            principal da Home. O carrossel troca automaticamente
            a cada 5 segundos.
          </p>

          {heroImages.map((img, index) => (
            <ImageUploadField
              key={index}
              label={`Imagem ${index + 1} do carrossel`}
              value={img}
              uploadType={`hero-${index}`}
              uploading={uploading[`hero-${index}`]}
              onUrlChange={url => updateHeroImageUrl(index, url)}
              onFileChange={file =>
                handleImageUpload(
                  file,
                  `hero-${index}`,
                  url => updateHeroImageUrl(index, url)
                )
              }
              onRemove={heroImages.length > 1
                ? () => removeHeroImage(index)
                : null
              }
            />
          ))}

          {heroImages.length < 3 && (
            <button
              type="button"
              onClick={addHeroImage}
              className={styles.addImageBtn}
            >
              + Adicionar imagem ao carrossel
            </button>
          )}

          {/* Textos do hero */}
          <div className={styles.grid} style={{ marginTop: 24 }}>
            <div className={styles.field}>
              <label className={styles.label}>Label (texto pequeno acima)</label>
              <input
                type="text"
                value={heroLabel}
                onChange={e => setHeroLabel(e.target.value)}
                className={styles.input}
                placeholder="NOVA COLEÇÃO 2025"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Título principal</label>
              <input
                type="text"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                className={styles.input}
                placeholder="Feita para destacar você"
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Subtítulo</label>
              <textarea
                value={heroSubtitle}
                onChange={e => setHeroSubtitle(e.target.value)}
                className={styles.textarea}
                rows={2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 2: BANNERS DE COLEÇÃO ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🏷️ Banners de Coleção
        </h2>

        {/* Banner 1 */}
        <div className={styles.bannerSection}>
          <h3 className={styles.bannerTitle}>Banner 1</h3>
          <div className={styles.formCard}>
            <ImageUploadField
              label="Imagem do Banner 1"
              value={banner1.imageUrl}
              uploadType="banner1"
              uploading={uploading['banner1']}
              onUrlChange={url =>
                setBanner1(prev => ({ ...prev, imageUrl: url }))
              }
              onFileChange={file =>
                handleImageUpload(
                  file, 'banner1',
                  url => setBanner1(prev => ({ ...prev, imageUrl: url }))
                )
              }
            />
            <div className={styles.bannerGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Título</label>
                <input
                  type="text"
                  value={banner1.title}
                  onChange={e =>
                    setBanner1(p => ({ ...p, title: e.target.value }))
                  }
                  className={styles.input}
                  placeholder="Ex: Coleção Ouro"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Subtítulo</label>
                <input
                  type="text"
                  value={banner1.subtitle}
                  onChange={e =>
                    setBanner1(p => ({ ...p, subtitle: e.target.value }))
                  }
                  className={styles.input}
                  placeholder="Ex: Brilhe com sofisticação"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Link destino</label>
                <input
                  type="text"
                  value={banner1.link}
                  onChange={e =>
                    setBanner1(p => ({ ...p, link: e.target.value }))
                  }
                  className={styles.input}
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
            <ImageUploadField
              label="Imagem do Banner 2"
              value={banner2.imageUrl}
              uploadType="banner2"
              uploading={uploading['banner2']}
              onUrlChange={url =>
                setBanner2(prev => ({ ...prev, imageUrl: url }))
              }
              onFileChange={file =>
                handleImageUpload(
                  file, 'banner2',
                  url => setBanner2(prev => ({ ...prev, imageUrl: url }))
                )
              }
            />
            <div className={styles.bannerGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Título</label>
                <input
                  type="text"
                  value={banner2.title}
                  onChange={e =>
                    setBanner2(p => ({ ...p, title: e.target.value }))
                  }
                  className={styles.input}
                  placeholder="Ex: Coleção Prata"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Subtítulo</label>
                <input
                  type="text"
                  value={banner2.subtitle}
                  onChange={e =>
                    setBanner2(p => ({ ...p, subtitle: e.target.value }))
                  }
                  className={styles.input}
                  placeholder="Ex: Elegância atemporal"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Link destino</label>
                <input
                  type="text"
                  value={banner2.link}
                  onChange={e =>
                    setBanner2(p => ({ ...p, link: e.target.value }))
                  }
                  className={styles.input}
                  placeholder="/loja?categoria=pulseiras"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: CATEGORIAS ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          ✨ Categorias
        </h2>
        <p className={styles.helpText}>
          Gerencie as imagens para cada uma das categorias exibidas na home.
        </p>

        <div className={styles.grid}>
          {['aneis', 'colares', 'pulseiras', 'brincos', 'conjuntos'].map((catKey) => {
            const labelMap = {
              aneis: 'Anéis',
              colares: 'Colares',
              pulseiras: 'Pulseiras',
              brincos: 'Brincos',
              conjuntos: 'Conjuntos',
            };
            return (
              <div key={catKey} className={styles.formCard}>
                <ImageUploadField
                  label={`Imagem - ${labelMap[catKey]}`}
                  value={categories[catKey]?.imageUrl || ''}
                  uploadType={`cat-${catKey}`}
                  uploading={uploading[`cat-${catKey}`]}
                  onUrlChange={(url) =>
                    setCategories((prev) => ({
                      ...prev,
                      [catKey]: { ...prev[catKey], imageUrl: url },
                    }))
                  }
                  onFileChange={(file) =>
                    handleImageUpload(file, 'categories', (url) =>
                      setCategories((prev) => ({
                        ...prev,
                        [catKey]: { ...prev[catKey], imageUrl: url },
                      }))
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SEÇÃO 4: LINKS SOCIAIS ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          📱 Links das Redes Sociais
        </h2>
        <div className={styles.formCard}>
          <p className={styles.helpText}>
            Esses links aparecem no rodapé do site e são
            clicáveis. Coloque o link completo incluindo https://
          </p>

          <div className={styles.field}>
            <label className={styles.label}>
              🟢 WhatsApp (link completo)
            </label>
            <input
              type="text"
              value={whatsappLink}
              onChange={e => setWhatsappLink(e.target.value)}
              className={styles.input}
              placeholder="https://wa.me/5585999999999"
            />
            <span className={styles.fieldHint}>
              Use: https://wa.me/ + código do país + DDD + número
              (sem espaços). Ex: https://wa.me/5585999999999
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              📸 Instagram (link completo)
            </label>
            <input
              type="text"
              value={instagramLink}
              onChange={e => setInstagramLink(e.target.value)}
              className={styles.input}
              placeholder="https://instagram.com/veranne.oficial"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              🎵 TikTok (link completo)
            </label>
            <input
              type="text"
              value={tiktokLink}
              onChange={e => setTiktokLink(e.target.value)}
              className={styles.input}
              placeholder="https://tiktok.com/@veranne.oficial"
            />
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 4: PRODUTOS EM DESTAQUE ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          ⭐ Produtos em Destaque
          <span className={styles.counter}>
            {featuredIds.length} de 8 selecionados
          </span>
        </h2>
        <div className={styles.formCard}>
          <p className={styles.helpText}>
            Selecione até 8 produtos que aparecem na seção
            de destaques da Home.
          </p>

          <div className={styles.productsGrid}>
            {products.map((product) => (
              <div
                key={product.id}
                className={`${styles.productCard} ${featuredIds.includes(product.id) ? styles.selected : ''}`}
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
                  {featuredIds.includes(product.id) ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Toast message={toast.message} visible={toast.show} />
    </div>
  )
}

/* ── Componente reutilizável de upload de imagem ── */
function ImageUploadField({
  label, value, uploadType, uploading,
  onUrlChange, onFileChange, onRemove
}) {
  const inputRef = useRef(null)

  return (
    <div className={styles.imageField}>
      <label className={styles.label}>{label}</label>

      <div className={styles.imageFieldBody}>
        {/* Preview */}
        <div className={styles.imagePreviewBox}>
          {value ? (
            <img src={value} alt="Preview" />
          ) : (
            <div className={styles.imagePlaceholder}>
              Sem imagem
            </div>
          )}
        </div>

        {/* Ações */}
        <div className={styles.imageActions}>
          {/* Upload do computador */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={styles.uploadBtn}
          >
            {uploading
              ? '⏳ Enviando...'
              : '📁 Escolher do computador'
            }
          </button>

          {/* OU URL */}
          <div className={styles.orDivider}>ou</div>
          <input
            type="text"
            value={value || ''}
            onChange={e => onUrlChange(e.target.value)}
            placeholder="Cole uma URL de imagem"
            className={styles.urlInput}
          />

          {/* Remover */}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className={styles.removeBtn}
            >
              ✕ Remover
            </button>
          )}
        </div>
      </div>

      {/* Input file oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={e => onFileChange(e.target.files?.[0])}
        style={{ display: 'none' }}
      />
    </div>
  )
}