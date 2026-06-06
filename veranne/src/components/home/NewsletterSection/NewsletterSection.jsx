import React, { useEffect, useMemo, useState } from 'react'
import styles from './NewsletterSection.module.css'
import { useScrollReveal } from '../../../hooks/useScrollReveal.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterSection() {
  const [ref, isVisible] = useScrollReveal()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const initialEmail = useMemo(() => {
    try {
      return localStorage.getItem('veranne_newsletter') || ''
    } catch {
      return ''
    }
  }, [])

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail)
  }, [initialEmail])

  function validate(v) {
    if (!v || !v.trim()) return 'Informe seu e-mail.'
    if (!EMAIL_RE.test(v.trim())) return 'E-mail inválido. Verifique e tente novamente.'
    return null
  }

  function onSubmit(e) {
    e.preventDefault()
    const err = validate(email)
    setError(err)
    setMessage(null)
    if (err) return

    try {
      localStorage.setItem('veranne_newsletter', email.trim())
    } catch {
      // MVP: ignorar erros de storage
    }

    setMessage('Obrigada! Em breve você receberá nossas novidades.')
    window.setTimeout(() => setMessage(null), 3000)
  }

  return (
    <section ref={ref} className={styles.section} aria-label="Newsletter">
      <div className={isVisible ? styles.visible : styles.hidden}>
        <div className={styles.inner}>
          <h2 className={styles.title}>Seja a primeira a saber</h2>
          <p className={styles.subtitle}>
            Receba novidades, lançamentos exclusivos e ofertas especiais diretamente no seu e-mail.
          </p>

          <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.field}>
              <input
                className={styles.input}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                inputMode="email"
                aria-label="Seu e-mail"
              />
            </div>

            <button type="submit" className={styles.button}>
              Inscrever
            </button>
          </form>

          {error ? <div className={styles.error}>{error}</div> : null}
          {message ? <div className={styles.success}>{message}</div> : null}

          <div className={styles.privacy}>
            Respeitamos sua privacidade. Cancele quando quiser.
          </div>

          {/* TODO: integrar com Mailchimp, RD Station ou similar */}
        </div>
      </div>
    </section>
  )
}
