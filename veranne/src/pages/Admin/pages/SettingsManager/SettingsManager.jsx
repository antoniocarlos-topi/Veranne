import React, { useState, useEffect } from 'react'
import { useConfig } from '../../../../context/ConfigContext.jsx'
import Toast from '../../../../components/ui/Toast/Toast'
import styles from './SettingsManager.module.css'

const STORAGE_PASSWORD_KEY = 'veranne_admin_password'
const DEFAULT_PASSWORD = 'veranne2025'

export default function SettingsManager() {
  const { config: settings, updateConfig: updateSettings } = useConfig()
  const [formData, setFormData] = useState({
    whatsappNumber: settings.whatsappNumber || '',
    storeEmail: settings.storeEmail || '',
    instagram: settings.instagram || '',
    tiktok: settings.tiktok || '',
    freeShippingAbove: settings.freeShippingAbove?.toString() || '',
  })

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })

  // Sync with settings data
  useEffect(() => {
    setFormData({
      whatsappNumber: settings.whatsappNumber || '',
      storeEmail: settings.storeEmail || '',
      instagram: settings.instagram || '',
      tiktok: settings.tiktok || '',
      freeShippingAbove: settings.freeShippingAbove?.toString() || '',
    })
  }, [settings])

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  function handlePasswordChange(field, value) {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  function handleSaveSettings() {
    updateSettings({
      ...formData,
      freeShippingAbove: formData.freeShippingAbove
        ? Number(formData.freeShippingAbove)
        : 0,
    })

    setToast({ show: true, message: '✅ Configurações salvas com sucesso!' })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  function handleSavePassword() {
    const newErrors = {}

    const currentPassword =
      localStorage.getItem(STORAGE_PASSWORD_KEY) || DEFAULT_PASSWORD

    if (passwordData.current !== currentPassword) {
      newErrors.current = 'Senha atual incorreta'
    }

    if (!passwordData.new || passwordData.new.length < 6) {
      newErrors.new = 'Nova senha deve ter no mínimo 6 caracteres'
    }

    if (passwordData.new !== passwordData.confirm) {
      newErrors.confirm = 'As senhas não coincidem'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    localStorage.setItem(STORAGE_PASSWORD_KEY, passwordData.new)
    setPasswordData({ current: '', new: '', confirm: '' })
    setToast({ show: true, message: '✅ Senha atualizada com sucesso!' })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>Configurações</h1>

      {/* Contato e Redes Sociais */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Contato e Redes Sociais</h2>

        <div className={styles.card}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>WhatsApp *</label>
              <input
                className={`${styles.input} ${errors.whatsappNumber ? styles.error : ''}`}
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="5585999999999"
              />
              <span className={styles.helpText}>
                Código do país + DDD + número, sem espaços ou caracteres
              </span>
              {errors.whatsappNumber && (
                <span className={styles.errorText}>{errors.whatsappNumber}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>E-mail da Loja *</label>
              <input
                type="email"
                className={`${styles.input} ${errors.storeEmail ? styles.error : ''}`}
                value={formData.storeEmail}
                onChange={(e) => handleChange('storeEmail', e.target.value)}
                placeholder="contato@veranne.com.br"
              />
              {errors.storeEmail && (
                <span className={styles.errorText}>{errors.storeEmail}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Instagram</label>
              <input
                className={styles.input}
                value={formData.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="@veranne.oficial"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>TikTok</label>
              <input
                className={styles.input}
                value={formData.tiktok}
                onChange={(e) => handleChange('tiktok', e.target.value)}
                placeholder="@veranne.oficial"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Frete */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Frete</h2>

        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.label}>
              Frete grátis em pedidos acima de:
              <div className={styles.inputGroup}>
                <span className={styles.prefix}>R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={styles.input}
                  value={formData.freeShippingAbove}
                  onChange={(e) => handleChange('freeShippingAbove', e.target.value)}
                  placeholder="199,90"
                />
              </div>
            </label>
            <span className={styles.helpText}>
              Use 0 para sempre cobrar frete ou 99999 para nunca ter frete grátis
            </span>
          </div>
        </div>
      </section>

      {/* Segurança */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Segurança</h2>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Alterar Senha do Admin</h3>

          <div className={styles.passwordGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Senha Atual</label>
              <input
                type="password"
                className={`${styles.input} ${errors.current ? styles.error : ''}`}
                value={passwordData.current}
                onChange={(e) => handlePasswordChange('current', e.target.value)}
                placeholder="••••••••"
              />
              {errors.current && (
                <span className={styles.errorText}>{errors.current}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Nova Senha</label>
              <input
                type="password"
                className={`${styles.input} ${errors.new ? styles.error : ''}`}
                value={passwordData.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.new && (
                <span className={styles.errorText}>{errors.new}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Confirmar Nova Senha</label>
              <input
                type="password"
                className={`${styles.input} ${errors.confirm ? styles.error : ''}`}
                value={passwordData.confirm}
                onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                placeholder="••••••••"
              />
              {errors.confirm && (
                <span className={styles.errorText}>{errors.confirm}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className={styles.passwordBtn}
            onClick={handleSavePassword}
          >
            Atualizar Senha
          </button>
        </div>
      </section>

      {/* Save Button */}
      <button
        type="button"
        className={styles.saveBtn}
        onClick={handleSaveSettings}
      >
        Salvar Configurações
      </button>

      <Toast message={toast.message} visible={toast.show} />
    </div>
  )
}