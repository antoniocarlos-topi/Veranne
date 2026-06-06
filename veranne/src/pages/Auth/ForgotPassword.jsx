// ============================================================
// VERANNE — Forgot Password Page (standalone, rota /esqueci-senha)
// ============================================================

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Auth.module.css'
import logoMarca from '../../../image/logomarca.jpeg'
import logoTipo from '../../../image/logotipo.jpeg'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Informe seu e-mail')
      return
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('E-mail inválido')
      return
    }
    
    // TODO: supabase.auth.resetPasswordForEmail
    setSubmitted(true)
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        
        <div className={`${styles.authLogoArea} ${styles.staggerItem} ${styles.stagger1}`}>
          <img src={logoTipo} alt="VERANNE" className={styles.authLogotipo} />
          <h1 className={styles.authTitle}>Recuperar senha</h1>
          <p className={styles.authSubtitle}>ENVIAREMOS UM LINK PARA SEU E-MAIL</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className={`${styles.authForm} ${styles.staggerItem} ${styles.stagger2}`} noValidate>
            <div className={`${styles.inputWrapper} ${email ? styles.hasValue : ''}`}>
              <input
                type="email"
                id="forgot-email"
                placeholder=" "
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                className={`${styles.input} ${error ? styles.inputErr : ''}`}
                autoComplete="email"
              />
              <label htmlFor="forgot-email" className={styles.floatingLabel}>E-mail da conta</label>
              {error && <span className={styles.fieldErr}>{error}</span>}
            </div>
            
            <button type="submit" className={styles.btnPrimary}>
              ENVIAR LINK DE RECUPERAÇÃO
            </button>
          </form>
        ) : (
          <div className={`${styles.authForm} ${styles.staggerItem} ${styles.stagger2}`} style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#1a1a1a', lineHeight: 1.6 }}>
              Se houver uma conta associada a este e-mail, você receberá um link de redefinição em breve.
            </p>
          </div>
        )}

        <div className={`${styles.divider} ${styles.staggerItem} ${styles.stagger3}`}>
          <div className={styles.dividerLine} />
          <div className={styles.dividerLine} />
        </div>

        <div className={`${styles.newUserSection} ${styles.staggerItem} ${styles.stagger4}`} style={{marginTop: '0'}}>
          <span className={styles.newUserText}>Lembrou a senha?</span>
          <Link to="/login" className={styles.createAccountLink}>
            VOLTAR AO LOGIN
          </Link>
        </div>

      </div>

      <div className={`${styles.authFooter} ${styles.staggerItem} ${styles.stagger5}`}>
        <div className={styles.footerLinks}>
          <Link to="/privacidade" className={styles.footerLink}>Privacidade</Link>
          <span>·</span>
          <Link to="/termos" className={styles.footerLink}>Termos de Uso</Link>
          <span>·</span>
          <Link to="/contato" className={styles.footerLink}>Ajuda</Link>
        </div>
        <p className={styles.footerCopy}>© 2025 VERANNE. Todos os direitos reservados.</p>
      </div>
    </div>
  )
}
