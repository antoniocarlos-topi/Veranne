// ============================================================
// VERANNE — Register Page (standalone, rota /cadastro)
// ============================================================

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Auth.module.css'
import logoMarca from '../../../image/logomarca.jpeg'
import logoTipo from '../../../image/logotipo.jpeg'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  function validate() {
    const errs = {}
    if (!name || name.trim().length < 2) errs.name = 'Nome deve ter pelo menos 2 caracteres'
    if (!email) errs.email = 'Informe seu e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'E-mail inválido'
    if (!password) errs.password = 'Informe uma senha'
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
    if (!confirmPassword) errs.confirmPassword = 'Confirme sua senha'
    else if (confirmPassword !== password) errs.confirmPassword = 'As senhas não coincidem'
    if (!termsAccepted) errs.terms = 'Você precisa aceitar os termos'
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
      name: name.trim(),
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
          <h1 className={styles.authTitle}>Crie sua conta</h1>
          <p className={styles.authSubtitle}>JUNTE-SE À VERANNE</p>
        </div>

        <form onSubmit={handleSubmit} className={`${styles.authForm} ${styles.staggerItem} ${styles.stagger2}`} noValidate>
          <div className={`${styles.inputWrapper} ${name ? styles.hasValue : ''}`}>
            <input
              type="text"
              id="register-name-page"
              placeholder=" "
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
              className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
              autoComplete="name"
            />
            <label htmlFor="register-name-page" className={styles.floatingLabel}>Nome completo</label>
            {errors.name && <span className={styles.fieldErr}>{errors.name}</span>}
          </div>

          <div className={`${styles.inputWrapper} ${email ? styles.hasValue : ''}`}>
            <input
              type="email"
              id="register-email-page"
              placeholder=" "
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
              className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
              autoComplete="email"
            />
            <label htmlFor="register-email-page" className={styles.floatingLabel}>E-mail</label>
            {errors.email && <span className={styles.fieldErr}>{errors.email}</span>}
          </div>

          <div className={`${styles.inputWrapper} ${password ? styles.hasValue : ''}`}>
            <input
              type="password"
              id="register-pass-page"
              placeholder=" "
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
              className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
              autoComplete="new-password"
            />
            <label htmlFor="register-pass-page" className={styles.floatingLabel}>Senha</label>
            {errors.password && <span className={styles.fieldErr}>{errors.password}</span>}
          </div>

          <div className={`${styles.inputWrapper} ${confirmPassword ? styles.hasValue : ''}`}>
            <input
              type="password"
              id="register-confirm-page"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })) }}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputErr : ''}`}
              autoComplete="new-password"
            />
            <label htmlFor="register-confirm-page" className={styles.floatingLabel}>Confirmar senha</label>
            {errors.confirmPassword && <span className={styles.fieldErr}>{errors.confirmPassword}</span>}
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="register-terms"
              checked={termsAccepted}
              onChange={(e) => { setTermsAccepted(e.target.checked); setErrors(p => ({ ...p, terms: '' })) }}
            />
            <label htmlFor="register-terms">
              Aceito os <Link to="/termos">Termos de Uso</Link> e a <Link to="/privacidade">Política de Privacidade</Link>
            </label>
          </div>
          {errors.terms && <span className={styles.fieldErr} style={{marginTop: '-8px', marginBottom: '16px'}}>{errors.terms}</span>}

          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="register-newsletter" defaultChecked />
            <label htmlFor="register-newsletter">
              Quero receber novidades por e-mail
            </label>
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'CRIANDO CONTA...' : 'CRIAR MINHA CONTA'}
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
          <span className={styles.newUserText}>Já tem conta?</span>
          <Link to="/login" className={styles.createAccountLink}>
            FAZER LOGIN
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
