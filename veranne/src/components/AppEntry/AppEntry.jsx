import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './AppEntry.module.css'
import { useAuth } from '../../context/AuthContext.jsx'
import logoMarca from '../../../image/logomarca.jpeg'
import logoTipo from '../../../image/logotipo.jpeg'

const ERROR_MESSAGES = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
  'User already registered': 'Este e-mail já está cadastrado.',
  'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
  'invalid_credentials': 'E-mail ou senha incorretos.',
}

function getErrorMessage(error) {
  if (!error) return 'Ocorreu um erro. Tente novamente.'
  
  const msg = (error.message || error.error_description || error.msg || '').toLowerCase()
  
  if (msg.includes('invalid login credentials') || msg.includes('invalid_credentials')) return 'E-mail ou senha incorretos.'
  if (msg.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
  if (msg.includes('user already registered') || msg.includes('already exists')) return 'Este e-mail já está cadastrado.'
  if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.'
  if (msg.includes('rate limit') || msg.includes('too many requests')) return 'Muitas tentativas. Tente novamente mais tarde.'
  
  return 'Ocorreu um erro. Tente novamente.'
}

export default function AppEntry({ children }) {
  const { login, register, loginAsGuest, isAuthenticated, authLoading } = useAuth()
  const [phase, setPhase] = useState('checking') // checking | intro | login | welcome | app
  const [view, setView] = useState('login') // 'login' | 'register'
  
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  // Transição de animação
  const [introAnim, setIntroAnim] = useState('fadeIn')
  const [screenAnim, setScreenAnim] = useState('')

  // REF para evitar que o useEffect interfira quando showWelcome está rodando
  const manualTransition = useRef(false)

  useEffect(() => {
    if (!authLoading) {
      // Se a transição está sendo controlada manualmente (guest/login/register), 
      // NÃO interferir
      if (manualTransition.current) return

      const seen = sessionStorage.getItem('veranne_intro_seen')
      if (isAuthenticated && seen) {
        setPhase('app')
      } else if (isAuthenticated && !seen) {
        showWelcome()
      } else {
        if (phase === 'checking') {
          setPhase('intro')
          setIntroAnim('fadeIn')
          const t1 = setTimeout(() => { setIntroAnim('fadeOut') }, 1400)
          const t2 = setTimeout(() => { setScreenAnim('screenFadeOut') }, 2100)
          const t3 = setTimeout(() => {
            setPhase('login')
            setScreenAnim('screenFadeIn')
          }, 2500)
          return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); }
        }
      }
    }
  }, [authLoading, isAuthenticated])

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  function validateLogin() {
    const errs = {}
    if (!email) errs.email = 'Informe seu e-mail'
    else if (!validateEmail(email)) errs.email = 'E-mail inválido'
    if (!password) errs.password = 'Informe sua senha'
    return errs
  }

  function validateRegister() {
    const errs = {}
    if (!name || name.trim().length < 2) errs.name = 'Nome muito curto'
    if (!email) errs.email = 'Informe seu e-mail'
    else if (!validateEmail(email)) errs.email = 'E-mail inválido'
    if (!password) errs.password = 'Informe sua senha'
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
    if (!confirmPassword) errs.confirmPassword = 'Confirme sua senha'
    else if (confirmPassword !== password) errs.confirmPassword = 'As senhas não coincidem'
    return errs
  }

  async function handleLogin(e) {
    e.preventDefault()
    const errs = validateLogin()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setAuthError('')
    try {
      manualTransition.current = true
      await login(email, password)
      sessionStorage.setItem('veranne_intro_seen', 'true')
      showWelcome()
    } catch (err) {
      manualTransition.current = false
      setAuthError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    const errs = validateRegister()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setAuthError('')
    try {
      manualTransition.current = true
      await register(email, password, name.trim())
      sessionStorage.setItem('veranne_intro_seen', 'true')
      showWelcome()
    } catch (err) {
      manualTransition.current = false
      setAuthError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  function handleGuest() {
    manualTransition.current = true
    sessionStorage.setItem('veranne_intro_seen', 'true')
    loginAsGuest()
    showWelcome()
  }

  function showWelcome() {
    setScreenAnim('screenFadeOut')
    setTimeout(() => {
      setPhase('welcome')
      setScreenAnim('screenFadeIn')
    }, 400)
    setTimeout(() => {
      setScreenAnim('screenFadeOut')
    }, 400 + 2200)
    setTimeout(() => {
      manualTransition.current = false
      setPhase('app')
      setScreenAnim('screenFadeIn')
    }, 400 + 2800)
  }

  function switchToRegister() {
    setErrors({})
    setAuthError('')
    setView('register')
  }

  function switchToLogin() {
    setErrors({})
    setAuthError('')
    setView('login')
  }

  if (phase === 'checking' || authLoading) return null
  if (phase === 'app') return <>{children}</>

  // ─── INTRO ──────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className={`${styles.screen} ${styles.introScreen} ${screenAnim ? styles[screenAnim] : ''}`}>
        <img src={logoMarca} alt="VERANNE" className={`${styles.introLogo} ${styles[introAnim]}`} />
      </div>
    )
  }

  // ─── BOAS-VINDAS ────────────────────────────────────────
  if (phase === 'welcome') {
    return (
      <div className={`${styles.screen} ${styles.welcomeScreen} ${screenAnim ? styles[screenAnim] : ''}`}>
        <div className={styles.welcomeContent}>
          <img src={logoMarca} alt="VERANNE" className={`${styles.welcomeLogo} ${styles.fadeInUp}`} />
          <p className={`${styles.welcomeText} ${styles.fadeInUpDelay}`}>
            Seja bem-vinda
          </p>
        </div>
      </div>
    )
  }

  // ─── LOGIN / CADASTRO ────────────────────────────────────
  return (
    <div className={`${styles.screen} ${styles.loginScreen} ${screenAnim ? styles[screenAnim] : ''}`}>
      <div className={styles.loginCard}>
        
        {/* VIEW: Login */}
        <div className={`${styles.formPanel} ${view === 'login' ? styles.formVisible : styles.formHidden}`}>
          {view === 'login' && (
            <>
              <div className={`${styles.loginLogoArea} ${styles.staggerItem} ${styles.stagger1}`}>
                <img src={logoTipo} alt="VERANNE" className={styles.loginLogotipo} />
                <h2 className={styles.loginTitle}>Bem-vinda de volta</h2>
                <p className={styles.loginSubtitle}>ACESSE SUA CONTA EXCLUSIVA</p>
              </div>

              {authError && <div className={styles.fieldError} style={{textAlign: 'center', marginBottom: '16px'}}>{authError}</div>}

              <form onSubmit={handleLogin} noValidate className={`${styles.staggerItem} ${styles.stagger2}`}>
                <div className={`${styles.inputWrapper} ${email ? styles.hasValue : ''}`}>
                  <input
                    id="login-email"
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    autoComplete="email"
                  />
                  <label htmlFor="login-email" className={styles.floatingLabel}>E-mail</label>
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>

                <div className={styles.inputWrapper}>
                  <input
                    id="login-password"
                    type="password"
                    placeholder=" "
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    autoComplete="current-password"
                  />
                  <label htmlFor="login-password" className={styles.floatingLabel}>Senha</label>
                  <Link to="/esqueci-senha" className={styles.forgotLink}>Esqueci minha senha</Link>
                  {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                </div>

                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : 'ENTRAR'}
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
                <button type="button" className={styles.createAccountLink} onClick={switchToRegister}>
                  CRIAR UMA CONTA
                </button>
              </div>
            </>
          )}
        </div>

        {/* VIEW: Cadastro */}
        <div className={`${styles.formPanel} ${view === 'register' ? styles.formVisible : styles.formHidden}`}>
          {view === 'register' && (
            <>
              <div className={`${styles.loginLogoArea} ${styles.staggerItem} ${styles.stagger1}`}>
                <img src={logoTipo} alt="VERANNE" className={styles.loginLogotipo} />
                <h2 className={styles.loginTitle}>Crie sua conta</h2>
                <p className={styles.loginSubtitle}>JUNTE-SE À VERANNE</p>
              </div>

              {authError && <div className={styles.fieldError} style={{textAlign: 'center', marginBottom: '16px'}}>{authError}</div>}

              <form onSubmit={handleRegister} noValidate className={`${styles.staggerItem} ${styles.stagger2}`}>
                <div className={`${styles.inputWrapper} ${name ? styles.hasValue : ''}`}>
                  <input
                    id="register-name"
                    type="text"
                    placeholder=" "
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    autoComplete="name"
                  />
                  <label htmlFor="register-name" className={styles.floatingLabel}>Nome completo</label>
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>

                <div className={`${styles.inputWrapper} ${email ? styles.hasValue : ''}`}>
                  <input
                    id="register-email"
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    autoComplete="email"
                  />
                  <label htmlFor="register-email" className={styles.floatingLabel}>E-mail</label>
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>

                <div className={`${styles.inputWrapper} ${password ? styles.hasValue : ''}`}>
                  <input
                    id="register-password"
                    type="password"
                    placeholder=" "
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    autoComplete="new-password"
                  />
                  <label htmlFor="register-password" className={styles.floatingLabel}>Senha</label>
                  {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                </div>

                <div className={`${styles.inputWrapper} ${confirmPassword ? styles.hasValue : ''}`}>
                  <input
                    id="register-confirm-password"
                    type="password"
                    placeholder=" "
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: '' })) }}
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                    autoComplete="new-password"
                  />
                  <label htmlFor="register-confirm-password" className={styles.floatingLabel}>Confirmar senha</label>
                  {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className={styles.btnPrimary} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : 'CRIAR MINHA CONTA'}
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
                <button type="button" className={styles.createAccountLink} onClick={switchToLogin}>
                  FAZER LOGIN
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`${styles.loginFooter} ${styles.staggerItem} ${styles.stagger6}`}>
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
