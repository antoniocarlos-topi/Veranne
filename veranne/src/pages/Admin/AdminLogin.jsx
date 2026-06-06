import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminLogin.module.css'
import logoMarca from '../../../image/logomarca.jpeg'

const STORAGE_AUTH_KEY = 'veranne_admin'
const STORAGE_PASSWORD_KEY = 'veranne_admin_password'
const ADMIN_USER = 'admin'
const DEFAULT_ADMIN_PASS = 'veranne2025'

function getStoredPassword() {
  const saved = localStorage.getItem(STORAGE_PASSWORD_KEY)
  return saved || DEFAULT_ADMIN_PASS
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate a small delay for better UX
    setTimeout(() => {
      const storedPass = getStoredPassword()
      if (username !== ADMIN_USER || password !== storedPass) {
        setError('Usuário ou senha incorretos')
        setLoading(false)
        return
      }

      localStorage.setItem(
        STORAGE_AUTH_KEY,
        JSON.stringify({ authenticated: true, loginAt: Date.now() })
      )

      navigate('/admin/dashboard', { replace: true })
    }, 400)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src={logoMarca} alt="VERANNE" className={styles.logoImg} />
        </div>
        <div className={styles.subtitle}>Painel Administrativo</div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.label}>
            Usuário
            <input
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="admin"
            />
          </label>

          <label className={styles.label}>
            Senha
            <input
              className={styles.input}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {error ? <div className={styles.error}>{error}</div> : null}
        </form>
      </div>
    </div>
  )
}