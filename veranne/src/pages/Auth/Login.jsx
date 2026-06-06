// ============================================================
// VERANNE — Login Page (standalone, rota /login)
// ============================================================

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Auth.module.css'
import logoMarca from '../../../image/logomarca.jpeg'
import logoTipo from '../../../image/logotipo.jpeg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const errs = {}
    if (!email) errs.email = 'Informe seu e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'E-mail inválido'
    if (!password) errs.password = 'Informe sua senha'
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const userData = {
      email,
      name: email.split('@')[0],
      isGuest: false,
      loginAt: Date.now(),
    }

    sessionStorage.setItem('veranne_user', JSON.stringify(userData))
    sessionStorage.setItem('veranne_intro_seen', 'true')
    login(userData)
    setLoading(false)
    navigate('/minha-conta')
  }

  const handleGuest = () => {
    const guestData = { name: 'Visitante', isGuest: true }
    sessionStorage.setItem('veranne_intro_seen', 'true')
    login(guestData)
    navigate('/')
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        
        <div className={`${styles.authLogoArea} ${styles.staggerItem} ${styles.stagger1}`}>
          <img src={logoTipo} alt="VERANNE" className={styles.authLogotipo} />
          <h1 className={styles.authTitle}>Bem-vinda de volta</h1>
          <p className={styles.authSubtitle}>ACESSE SUA CONTA EXCLUSIVA</p>
        </div>

        <form onSubmit={handleSubmit} className={`${styles.authForm} ${styles.staggerItem} ${styles.stagger2}`} noValidate>
          <div className={`${styles.inputWrapper} ${email ? styles.hasValue : ''}`}>
            <input
              type="email"
              id="login-email-page"
              placeholder=" "
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
              className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
              autoComplete="email"
            />
            <label htmlFor="login-email-page" className={styles.floatingLabel}>E-mail</label>
            {errors.email && <span className={styles.fieldErr}>{errors.email}</span>}
          </div>

          <div className={`${styles.inputWrapper} ${password ? styles.hasValue : ''}`}>
            <input
              type="password"
              id="login-password-page"
              placeholder=" "
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
              className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
              autoComplete="current-password"
            />
            <label htmlFor="login-password-page" className={styles.floatingLabel}>Senha</label>
            <Link to="/esqueci-senha" className={styles.forgotLink}>Esqueci minha senha</Link>
            {errors.password && <span className={styles.fieldErr}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <div className={`${styles.divider} ${styles.staggerItem} ${styles.stagger3}`}>
          <div className={styles.dividerLine} />
          <span>OU</span>
          <div className={styles.dividerLine} />
        </div>

        <button
          className={`${styles.btnOutline} ${styles.staggerItem} ${styles.stagger4}`}
          onClick={handleGuest}
          type="button"
        >
          ENTRAR COMO CONVIDADO
        </button>

        <div className={`${styles.newUserSection} ${styles.staggerItem} ${styles.stagger5}`}>
          <span className={styles.newUserText}>Novo por aqui?</span>
          <Link to="/cadastro" className={styles.createAccountLink}>
            CRIAR UMA CONTA
          </Link>
        </div>

      </div>

      <div className={`${styles.authFooter} ${styles.staggerItem} ${styles.stagger6}`}>
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
