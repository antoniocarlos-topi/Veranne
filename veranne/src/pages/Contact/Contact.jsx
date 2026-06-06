import React, { useMemo, useState } from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import styles from './Contact.module.css'
import { useConfig } from '../../context/ConfigContext.jsx'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Dúvidas',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: null, text: '' })

  const { config } = useConfig()
  
  const whatsappLink = useMemo(() => {
    const text = `Olá! Vim pelo site da ${config.storeName} e gostaria de falar sobre: ${form.subject}.`
    return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`
  }, [form.subject, config])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Informe seu nome completo.'
    if (!form.email.trim() || !isValidEmail(form.email)) nextErrors.email = 'Informe um e-mail válido.'
    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = 'Escreva uma mensagem com pelo menos 10 caracteres.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus({ type: null, text: '' })

    if (!validate()) return

    // MVP: sem backend; simula envio
    setStatus({
      type: 'success',
      text: 'Mensagem enviada com sucesso! Em breve retornaremos.',
    })

    setForm({ name: '', email: '', subject: 'Dúvidas', message: '' })
    setErrors({})
  }

  return (
    <Layout>
      <div className={styles.wrap}>
        <div className={styles.container}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Contato</h1>
            <p className={styles.subtitle}>Estamos aqui para te ajudar.</p>
          </div>

          <div className={styles.grid}>
            <aside className={styles.left}>
              <h2 className={styles.leftTitle}>Fale com a VERANNE</h2>
              <p className={styles.leftText}>
                Tire suas dúvidas e receba orientações sobre peças, trocas e compras.
              </p>

              <div className={styles.whatsCard}>
                <div className={styles.whatsHeader}>
                  <span className={styles.whatsIcon} aria-hidden="true">
                    ⟡
                  </span>
                  <span className={styles.whatsText}>Atendimento via WhatsApp</span>
                </div>

                <a className={styles.whatsBtn} href={whatsappLink} target="_blank" rel="noreferrer">
                  Enviar mensagem no WhatsApp
                </a>

                <div className={styles.hours}>
                  Horário: Segunda a Sábado, 9h às 18h
                </div>
              </div>

              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.contactKey}>E-mail</span>
                  <a className={styles.contactValue} href={`mailto:${config.storeEmail}`}>
                    {config.storeEmail}
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactKey}>Instagram</span>
                  <a className={styles.contactValue} href={`https://instagram.com/${config.instagram}`} target="_blank" rel="noreferrer">
                    {config.instagram}
                  </a>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactKey}>TikTok</span>
                  <a className={styles.contactValue} href={`https://tiktok.com/${config.tiktok}`} target="_blank" rel="noreferrer">
                    {config.tiktok}
                  </a>
                </div>
              </div>
            </aside>

            <section className={styles.right}>
              <h2 className={styles.formTitle}>Envie uma mensagem</h2>

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span className={styles.label}>Nome completo</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                  {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>E-mail</span>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="voce@exemplo.com"
                    autoComplete="email"
                  />
                  {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Assunto</span>
                  <select
                    className={styles.select}
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  >
                    <option value="Dúvidas">Dúvidas</option>
                    <option value="Trocas">Trocas</option>
                    <option value="Pedidos">Pedidos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Mensagem</span>
                  <textarea
                    className={styles.textarea}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Escreva sua mensagem..."
                    rows={5}
                  />
                  {errors.message ? <span className={styles.error}>{errors.message}</span> : null}
                </label>

                <button type="submit" className={styles.submitBtn}>
                  Enviar Mensagem
                </button>

                {status.type === 'success' ? (
                  <div className={styles.success}>{status.text}</div>
                ) : null}
              </form>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}
