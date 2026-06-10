import React, { useState } from 'react'
import { useCoupons } from '../../../../context/CouponsContext.jsx'
import Toast from '../../../../components/ui/Toast/Toast'
import styles from './CouponsManager.module.css'

function formatBRL(value) {
  const n = Number(value || 0)
  return n.toFixed(2).replace('.', ',')
}

function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

export default function CouponsManager() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCoupons()
  const [formData, setFormData] = useState({
    code: '',
    type: 'percent',
    value: '',
    min_order: '',
    usage_limit: '',
    expires_at: '',
  })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  function validate() {
    const newErrors = {}

    if (!formData.code.trim()) {
      newErrors.code = 'Código é obrigatório'
    } else if (formData.code.trim().length < 3) {
      newErrors.code = 'Código deve ter no mínimo 3 caracteres'
    }

    // Check for duplicate code
    const exists = coupons.some(
      (c) => c.code.toLowerCase() === formData.code.trim().toLowerCase()
    )
    if (exists) {
      newErrors.code = 'Este código já existe'
    }

    if (!formData.value || Number(formData.value) <= 0) {
      newErrors.value = 'Valor deve ser maior que zero'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleCreate() {
    if (!validate()) return

    try {
      console.log('Tentando criar cupom:', formData)
      const saved = await addCoupon({
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        min_order: formData.min_order ? Number(formData.min_order) : null,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
        expires_at: formData.expires_at || null,
      })
      console.log('Cupom criado:', saved)
      setToast({ show: true, message: '✅ Cupom criado!' })
      setFormData({
        code: '',
        type: 'percent',
        value: '',
        min_order: '',
        usage_limit: '',
        expires_at: '',
      })
      setErrors({})
    } catch (err) {
      console.error('Erro ao criar cupom:', err)
      setToast({ show: true, message: '❌ Erro: ' + err.message })
    } finally {
      setTimeout(() => setToast({ show: false, message: '' }), 3000)
    }
  }

  function handleToggleActive(coupon) {
    updateCoupon(coupon.id, { active: !coupon.active })
    setToast({
      show: true,
      message: coupon.active ? '✅ Cupom desativado!' : '✅ Cupom ativado!',
    })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  function handleDelete(couponId) {
    deleteCoupon(couponId)
    setDeleteConfirm(null)
    setToast({ show: true, message: '✅ Cupom excluído!' })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>Gerenciar Cupons</h1>

      {/* Cupons Existentes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Cupons Existentes
          <span className={styles.badge}>{coupons.length}</span>
        </h2>

        <div className={styles.card}>
          {coupons.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🎟️</span>
              <p className={styles.emptyText}>Nenhum cupom criado ainda.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Pedido Mínimo</th>
                    <th>Usos</th>
                    <th>Validade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>
                        <span className={styles.code}>{coupon.code}</span>
                      </td>
                      <td>
                        {coupon.type === 'percent' ? (
                          <span className={styles.typePercent}>Percentual</span>
                        ) : (
                          <span className={styles.typeFixed}>Valor Fixo</span>
                        )}
                      </td>
                      <td>
                        {coupon.type === 'percent' ? (
                          `${coupon.value}%`
                        ) : (
                          `R$ ${formatBRL(coupon.value)}`
                        )}
                      </td>
                      <td>
                        {coupon.min_order
                          ? `R$ ${formatBRL(coupon.min_order)}`
                          : '—'}
                      </td>
                      <td>
                        {coupon.usage_count || 0}
                        {coupon.usage_limit ? `/${coupon.usage_limit}` : ''}
                      </td>
                      <td>{formatDate(coupon.expires_at)}</td>
                      <td>
                        <label className={styles.switch}>
                          <input
                            type="checkbox"
                            checked={coupon.active}
                            onChange={() => handleToggleActive(coupon)}
                          />
                          <span className={styles.switchSlider} />
                        </label>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setDeleteConfirm(coupon)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Criar Novo Cupom */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Criar Novo Cupom</h2>

        <div className={styles.card}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Código *</label>
              <input
                className={`${styles.input} ${errors.code ? styles.error : ''}`}
                value={formData.code}
                onChange={(e) =>
                  handleChange('code', e.target.value.toUpperCase())
                }
                placeholder="EX: PROMO10"
                maxLength={20}
              />
              {errors.code && (
                <span className={styles.errorText}>{errors.code}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Tipo *</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="type"
                    value="percent"
                    checked={formData.type === 'percent'}
                    onChange={(e) => handleChange('type', e.target.value)}
                  />
                  <span className={styles.radioCustom} />
                  Percentual (%)
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="type"
                    value="fixed"
                    checked={formData.type === 'fixed'}
                    onChange={(e) => handleChange('type', e.target.value)}
                  />
                  <span className={styles.radioCustom} />
                  Valor fixo (R$)
                </label>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Valor do Desconto *
                <div className={styles.inputGroup}>
                  <span className={styles.prefix}>
                    {formData.type === 'percent' ? '%' : 'R$'}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`${styles.input} ${errors.value ? styles.error : ''}`}
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                    placeholder={formData.type === 'percent' ? '10' : '10,00'}
                  />
                </div>
              </label>
              {errors.value && (
                <span className={styles.errorText}>{errors.value}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Pedido Mínimo (opcional)</label>
              <div className={styles.inputGroup}>
                <span className={styles.prefix}>R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={styles.input}
                  value={formData.min_order}
                  onChange={(e) => handleChange('min_order', e.target.value)}
                  placeholder="Sem mínimo"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Limite de Usos (opcional)</label>
              <input
                className={styles.input}
                value={formData.usage_limit}
                onChange={(e) => handleChange('usage_limit', e.target.value)}
                placeholder="Ilimitado"
                type="number"
                min="1"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Data de Validade (opcional)</label>
              <input
                type="date"
                className={styles.input}
                value={formData.expires_at}
                onChange={(e) => handleChange('expires_at', e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className={styles.createBtn}
            onClick={handleCreate}
          >
            Criar Cupom
          </button>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Excluir Cupom</h3>
            <p className={styles.modalText}>
              Tem certeza que deseja excluir o cupom{' '}
              <strong>"{deleteConfirm.code}"</strong>?
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
                onClick={() => handleDelete(deleteConfirm.id)}
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