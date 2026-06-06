// src/context/FavoritesContext.jsx
import React, {
  createContext, useContext,
  useState, useEffect, useCallback
} from 'react'
import { useAuth } from './AuthContext'
import { useProductsContext } from './ProductsContext'
import { fetchFavorites, addFavorite, removeFavorite } from '../services/supabase'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const { products } = useProductsContext()

  const [favIds, setFavIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id && !user.isGuest) {
      loadFavs(user.id)
    } else {
      setFavIds([])
      setLoading(false)
    }
  }, [user])

  async function loadFavs(userId) {
    try {
      const ids = await fetchFavorites(userId)
      setFavIds(ids)
    } catch {
      setFavIds([])
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = useCallback(async (productOrId) => {
    // Aceita tanto um ID direto quanto um objeto { id: ... }
    const productId = typeof productOrId === 'string' ? productOrId : productOrId?.id
    if (!productId) return

    if (!user || user.isGuest) {
      alert('Faça login para salvar favoritos.')
      return
    }

    const isFav = favIds.includes(productId)
    // Atualização otimista
    setFavIds(prev => isFav
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
    )

    try {
      if (isFav) {
        await removeFavorite(user.id, productId)
      } else {
        await addFavorite(user.id, productId)
      }
    } catch (err) {
      console.error('[VERANNE] Erro ao alterar favorito:', err)
      // Reverter se falhar
      setFavIds(prev => isFav
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
      )
    }
  }, [user, favIds])

  // Função para checar se um produto é favorito
  const isFavorite = useCallback((productId) => {
    return favIds.includes(productId)
  }, [favIds])

  // Retorna lista completa de objetos Product baseada nos IDs favoritos
  const favorites = products.filter(p => favIds.includes(p.id))

  return (
    <FavoritesContext.Provider value={{
      favorites,     // array de produtos completos
      favIds,        // array de IDs
      loading,
      isFavorite,    // (id) => boolean
      toggleFavorite,
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites fora de FavoritesProvider')
  return ctx
}
