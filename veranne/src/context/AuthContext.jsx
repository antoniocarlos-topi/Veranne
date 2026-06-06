// src/context/AuthContext.jsx
import React, {
  createContext, useContext,
  useState, useEffect, useCallback
} from 'react'
import {
  supabase,
  signIn, signUp, signOut,
  fetchProfile
} from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,        setUser]        = useState(null)
  const [profile,     setProfile]     = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Carregar sessão ao iniciar
  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
      }
      setAuthLoading(false)
    })

    // Ouvir mudanças de auth (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setAuthLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    try {
      const data = await fetchProfile(userId)
      setProfile(data)
    } catch {
      // Perfil pode não existir ainda — normal
    }
  }

  // LOGIN REAL com Supabase
  const login = useCallback(async (email, password) => {
    const data = await signIn(email, password)
    return data
  }, [])

  // CADASTRO REAL com Supabase
  const register = useCallback(async (email, password, name) => {
    const data = await signUp(email, password, name)
    return data
  }, [])

  // LOGOUT
  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
    setProfile(null)
    // Limpar sessão da intro para mostrar tela de entrada novamente
    sessionStorage.removeItem('veranne_intro_seen')
    window.location.reload()
  }, [])

  // VISITANTE — sem autenticação
  const loginAsGuest = useCallback(() => {
    const guest = {
      id: `guest_${Date.now()}`,
      email: null,
      isGuest: true,
      name: 'Visitante',
    }
    setUser(guest)
  }, [])

  // Nome para exibição
  const displayName = profile?.name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'Visitante'

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      authLoading,
      isAuthenticated: Boolean(user),
      isGuest: user?.isGuest || false,
      isRealUser: Boolean(user && !user.isGuest),
      displayName,
      login,
      register,
      logout,
      loginAsGuest,
      loadProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth fora de AuthProvider')
  return ctx
}
