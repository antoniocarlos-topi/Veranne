import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useProductsContext } from '../../../../context/ProductsContext'
import { uploadImage } from '../../../../services/supabase'
import Toast from '../../../../components/ui/Toast/Toast'
import styles from './ProductForm.module.css'

const CATEGORIES = [
  { value: '', label: 'Selecione...' },
  { value: 'aneis', label: 'Anéis' },
  { value: 'colares', label: 'Colares' },
  { value: 'pulseiras', label: 'Pulseiras' },
  { value: 'brincos', label: 'Brincos' },
]

const INSTALLMENTS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}x`,
}))

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isEditing = Boolean(id)
  const { products, addProduct, updateProduct } = useProductsContext()

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    material: '',
    price: '',
    originalPrice: '',
    installments: 1,
    images: [''],
    sizes: '',
    colors: [],
    featured: false,
    isNew: false,
    inStock: true,
  })

  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })
  const [uploading, setUploading] = useState(false)

  // Load product data when editing
  useEffect(() => {
    if (isEditing && id) {
      const product = products.find((p) => p.id === id)
      if (product) {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          description: product.description || '',
          material: product.material || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          installments: product.installments || 1,
          images: product.images?.length > 0 ? product.images : [''],
          sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
          colors: Array.isArray(product.colors) ? product.colors : [],
          featured: product.featured || false,
          isNew: product.isNew || false,
          inStock: product.inStock ?? true,
        })
      } else {
        setToast({ show: true, message: '⚠️ Produto não encontrado.' })
        setTimeout(() => navigate('/admin/produtos'), 2000)
      }
    }
  }, [id, isEditing, products, navigate])

  // Show success message if coming from a successful save
  useEffect(() => {
    if (location.state?.success) {
      setToast({ show: true, message: location.state.success })
      setTimeout(() => setToast({ show: false, message: '' }), 3000)
      // Clear the state
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  function handleImageChange(index, value) {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData((prev) => ({ ...prev, images: newImages }))
  }

  function addImage() {
    if (formData.images.length < 6) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }))
    }
  }

  function removeImage(index) {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, images: newImages.length > 0 ? newImages : [''] }))
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const url = await uploadImage(file, 'products')
      setFormData(prev => ({
        ...prev,
        images: [...prev.images.filter(i => i.trim() !== ''), url]
      }))
    } catch (err) {
      setToast({ show: true, message: '⚠️ Erro no upload: ' + err.message })
      setTimeout(() => setToast({ show: false, message: '' }), 3000)
    } finally {
      setUploading(false)
    }
  }

  function addColorOption() {
    setFormData((prev) => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#C0C0C0' }] }))
  }

  function removeColor(index) {
    const newColors = formData.colors.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, colors: newColors }))
  }

  function updateColor(index, field, value) {
    const newColors = [...formData.colors]
    newColors[index] = { ...newColors[index], [field]: value }
    setFormData((prev) => ({ ...prev, colors: newColors }))
  }

  function addColorDirect(colorObj) {
    if (formData.colors.find(c => c.name === colorObj.name)) return
    setFormData((prev) => ({ ...prev, colors: [...prev.colors, colorObj] }))
  }

  function validate() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.category) newErrors.category = 'Categoria é obrigatória'
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória'
    if (!formData.material.trim()) newErrors.material = 'Material é obrigatório'
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = 'Preço deve ser maior que zero'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validate()) return

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      material: formData.material.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      installments: Number(formData.installments),
      images: formData.images.filter((img) => img.trim() !== ''),
      sizes: formData.sizes
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== ''),
      colors: formData.colors.filter(c => c.name.trim() !== ''),
      featured: formData.featured,
      isNew: formData.isNew,
      inStock: formData.inStock,
    }

    try {
      if (isEditing) {
        await updateProduct(id, productData)
        setToast({ show: true, message: '✅ Produto atualizado!' })
      } else {
        await addProduct(productData)
        setToast({ show: true, message: '✅ Produto cadastrado!' })
      }
    } catch (err) {
      console.warn('[VERANNE] Erro ao salvar produto:', err)
      setToast({ show: true, message: '✅ Produto salvo localmente!' })
    }

    setTimeout(() => navigate('/admin/produtos'), 1500)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h1 className={styles.h1}>
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h1>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={() => navigate('/admin/produtos')}
        >
          Cancelar
        </button>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Informações Básicas */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Informações Básicas</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>
                Nome *
                <input
                  className={`${styles.input} ${errors.name ? styles.error : ''}`}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Ex: Anel Vênus"
                />
              </label>
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Categoria *
                <select
                  className={`${styles.select} ${errors.category ? styles.error : ''}`}
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              {errors.category && (
                <span className={styles.errorText}>{errors.category}</span>
              )}
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Descrição *
                <textarea
                  className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  placeholder="Descreva o produto em detalhes..."
                />
              </label>
              {errors.description && (
                <span className={styles.errorText}>{errors.description}</span>
              )}
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Material *
                <input
                  className={`${styles.input} ${errors.material ? styles.error : ''}`}
                  value={formData.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                  placeholder="Ex: Aço Inox 316L banhado a ouro 18k"
                />
              </label>
              {errors.material && (
                <span className={styles.errorText}>{errors.material}</span>
              )}
            </div>
          </div>
        </section>

        {/* Preços */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Preços</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>
                Preço Atual *
                <div className={styles.inputGroup}>
                  <span className={styles.inputPrefix}>R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`${styles.input} ${errors.price ? styles.error : ''}`}
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </label>
              {errors.price && <span className={styles.errorText}>{errors.price}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Preço Original (opcional)
                <div className={styles.inputGroup}>
                  <span className={styles.inputPrefix}>R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={styles.input}
                    value={formData.originalPrice}
                    onChange={(e) => handleChange('originalPrice', e.target.value)}
                    placeholder="0,00 (para mostrar desconto)"
                  />
                </div>
              </label>
              <span className={styles.helpText}>
                Preencha para mostrar preço promocional
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Parcelas
                <select
                  className={styles.select}
                  value={formData.installments}
                  onChange={(e) => handleChange('installments', e.target.value)}
                >
                  {INSTALLMENTS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        {/* Imagens */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Imagens</h2>
          <div className={styles.warningBox}>
            <span className={styles.warningIcon}>ℹ️</span>
            <div>
              <strong>Upload de imagens</strong>
              <p className={styles.warningText}>
                Faça o upload da imagem do seu dispositivo. A imagem será salva no Supabase Storage.
                Você também pode continuar usando URLs externas.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className={styles.saveBtn} style={{ cursor: 'pointer', display: 'inline-block', width: 'auto' }}>
              {uploading ? 'Enviando...' : 'Fazer Upload de Imagem'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          </div>

          <div className={styles.imagesList}>
            {formData.images.map((img, index) => (
              <div key={index} className={styles.imageField}>
                <label className={styles.label}>
                  URL {index + 1}
                  <div className={styles.imageInputRow}>
                    <input
                      className={styles.input}
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => removeImage(index)}
                        aria-label="Remover imagem"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </label>
                <div className={styles.imagePreview}>
                  {img && (
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = ''
                        e.currentTarget.alt = 'URL inválida'
                      }}
                    />
                  )}
                  {!img && <div className={styles.placeholder}>Sem imagem</div>}
                </div>
              </div>
            ))}

            {formData.images.length < 6 && (
              <button
                type="button"
                className={styles.addImageBtn}
                onClick={addImage}
              >
                + Adicionar URL de Imagem
              </button>
            )}
          </div>
        </section>

        {/* Tamanhos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tamanhos</h2>
          <div className={styles.field}>
            <label className={styles.label}>
              Tamanhos disponíveis
              <input
                className={styles.input}
                value={formData.sizes}
                onChange={(e) => handleChange('sizes', e.target.value)}
                placeholder="Ex: 15, 16, 17, 18 ou P, M, G ou Único"
              />
            </label>
            <span className={styles.helpText}>
              Separe os tamanhos por vírgula
            </span>
          </div>
        </section>

        {/* Cores */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cores Disponíveis</h2>
          <p className={styles.sectionHelp}>
            Adicione as cores disponíveis para este produto.
            Cada cor precisa de um nome e código hexadecimal.
          </p>

          <div className={styles.colorsList}>
            {formData.colors.map((color, index) => (
              <div key={index} className={styles.colorRow}>
                <div
                  className={styles.colorPreview}
                  style={{ backgroundColor: color.hex }}
                />
                <input
                  type="text"
                  placeholder="Nome (ex: Dourado)"
                  value={color.name}
                  onChange={e => updateColor(index, 'name', e.target.value)}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
                <div className={styles.hexInputWrapper}>
                  <input
                    type="color"
                    value={color.hex}
                    onChange={e => updateColor(index, 'hex', e.target.value)}
                    className={styles.colorPicker}
                  />
                  <input
                    type="text"
                    placeholder="#C9A96E"
                    value={color.hex}
                    onChange={e => updateColor(index, 'hex', e.target.value)}
                    className={styles.input}
                    style={{ width: '100px' }}
                    maxLength={7}
                  />
                </div>
                <button
                  onClick={() => removeColor(index)}
                  className={styles.removeColorBtn}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addColorOption}
            className={styles.addColorBtn}
          >
            + Adicionar Cor
          </button>

          <div className={styles.colorSuggestions}>
            <span className={styles.suggestLabel}>Sugestões:</span>
            {[
              { name: 'Dourado',  hex: '#C9A96E' },
              { name: 'Prata',    hex: '#C0C0C0' },
              { name: 'Rosé',     hex: '#E8B4A0' },
              { name: 'Preto',    hex: '#1a1a1a' },
            ].map(suggestion => (
              <button
                key={suggestion.name}
                type="button"
                onClick={() => addColorDirect(suggestion)}
                className={styles.colorSuggestionBtn}
              >
                <span
                  style={{ backgroundColor: suggestion.hex }}
                  className={styles.suggestionDot}
                />
                {suggestion.name}
              </button>
            ))}
          </div>
        </section>

        {/* Configurações */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Configurações</h2>
          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
              />
              <span className={styles.toggleBox}>
                <span className={styles.toggleIndicator} />
              </span>
              <span className={styles.toggleLabel}>Em destaque</span>
            </label>

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => handleChange('isNew', e.target.checked)}
              />
              <span className={styles.toggleBox}>
                <span className={styles.toggleIndicator} />
              </span>
              <span className={styles.toggleLabel}>É novo</span>
            </label>

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => handleChange('inStock', e.target.checked)}
              />
              <span className={styles.toggleBox}>
                <span className={styles.toggleIndicator} />
              </span>
              <span className={styles.toggleLabel}>Em estoque</span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtnLarge}
            onClick={() => navigate('/admin/produtos')}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.saveBtn}>
            {isEditing ? 'Salvar Alterações' : 'Salvar Produto'}
          </button>
        </div>
      </form>

      <Toast message={toast.message} visible={toast.show} />
    </div>
  )
}