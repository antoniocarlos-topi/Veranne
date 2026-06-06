// src/context/HomepageContext.jsx
import React, {
  createContext, useContext,
  useState, useEffect, useCallback
} from 'react'
import {
  fetchHomepageConfig,
  upsertHomepageConfig
} from '../services/supabase'

const DEFAULT = {
  heroBannerUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=90',
  heroTitle:    'Feita para destacar você',
  heroSubtitle: 'Semijoias e joias em aço inox para a mulher que valoriza sofisticação e elegância.',
  heroLabel:    'NOVA COLEÇÃO 2025',
  featuredIds:  [],
  banner1: {
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
    title:    'Coleção Ouro',
    subtitle: 'Brilhe com sofisticação',
    link:     '/loja?categoria=colares',
  },
  banner2: {
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    title:    'Coleção Prata',
    subtitle: 'Elegância atemporal',
    link:     '/loja?categoria=pulseiras',
  },
}

// Mapear snake_case do banco para camelCase do app
function normalize(data) {
  if (!data) return DEFAULT
  return {
    heroBannerUrl: data.hero_banner_url || DEFAULT.heroBannerUrl,
    heroTitle:     data.hero_title      || DEFAULT.heroTitle,
    heroSubtitle:  data.hero_subtitle   || DEFAULT.heroSubtitle,
    heroLabel:     data.hero_label      || DEFAULT.heroLabel,
    featuredIds:   data.featured_ids    || DEFAULT.featuredIds,
    banner1:       data.banner1         || DEFAULT.banner1,
    banner2:       data.banner2         || DEFAULT.banner2,
  }
}

const HomepageContext = createContext(null)

export function HomepageProvider({ children }) {
  const [homepage, setHomepage] = useState(DEFAULT)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    loadHomepage()
  }, [])

  async function loadHomepage() {
    try {
      const data = await fetchHomepageConfig()
      setHomepage(normalize(data))
    } catch {
      setHomepage(DEFAULT)
    } finally {
      setLoading(false)
    }
  }

  const updateHomepage = useCallback(async (updates) => {
    const next = { ...homepage, ...updates }
    setHomepage(next)
    try {
      await upsertHomepageConfig({
        hero_banner_url: next.heroBannerUrl,
        hero_title:      next.heroTitle,
        hero_subtitle:   next.heroSubtitle,
        hero_label:      next.heroLabel,
        featured_ids:    next.featuredIds,
        banner1:         next.banner1,
        banner2:         next.banner2,
      })
    } catch (err) {
      console.error('[VERANNE] Erro ao salvar homepage:', err)
      throw err
    }
  }, [homepage])

  return (
    <HomepageContext.Provider value={{
      homepage,
      loading,
      updateHomepage,
      loadHomepage,
    }}>
      {children}
    </HomepageContext.Provider>
  )
}

export function useHomepage() {
  const ctx = useContext(HomepageContext)
  if (!ctx) throw new Error('useHomepage fora de HomepageProvider')
  return ctx
}
