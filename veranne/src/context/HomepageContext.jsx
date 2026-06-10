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
  // Hero — agora com múltiplas imagens
  heroImages: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=90',
    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1600&q=90',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=90',
  ],
  // Manter heroBannerUrl como fallback (primeira imagem)
  heroBannerUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=90',
  heroTitle:    'Feita para destacar você',
  heroSubtitle: 'Semijoias e joias em aço inox para a mulher que valoriza sofisticação e elegância.',
  heroLabel:    'NOVA COLEÇÃO 2025',
  featuredIds:  [],

  // Banners de coleção
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

  // Imagens das categorias (editáveis pelo admin)
  categoryImages: {
    todos:     'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    aneis:     'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80',
    colares:   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    pulseiras: 'https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=600&q=80',
    brincos:   'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80',
    conjuntos: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
  },

  // Links sociais editáveis pelo admin
  allCategoriesImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
  whatsappLink:  'https://wa.me/5585999999999',
  instagramLink: 'https://instagram.com/veranne.oficial',
  tiktokLink:    'https://tiktok.com/@veranne.oficial',
}

// Helper: valor existe e não é nulo/undefined
function has(v) {
  return v !== null && v !== undefined
}

// Helper: merge profundo de um banner (campo a campo)
function mergeBanner(saved, fallback) {
  if (!saved || typeof saved !== 'object') return fallback
  return {
    imageUrl: has(saved.imageUrl) ? saved.imageUrl
            : has(saved.image_url) ? saved.image_url
            : fallback.imageUrl,
    title:    has(saved.title)    ? saved.title    : fallback.title,
    subtitle: has(saved.subtitle) ? saved.subtitle : fallback.subtitle,
    link:     has(saved.link)     ? saved.link     : fallback.link,
  }
}

// Helper: merge categoryImages chave a chave
function mergeCategoryImages(saved, fallback) {
  if (!saved || typeof saved !== 'object') return fallback
  const merged = { ...fallback }
  for (const key of Object.keys(merged)) {
    const val = saved[key]
    if (has(val)) {
      if (typeof val === 'string') merged[key] = val
      else if (val.imageUrl) merged[key] = val.imageUrl
    }
  }
  return merged
}

// Mapear snake_case do banco para camelCase do app
function normalize(data) {
  if (!data) return DEFAULT

  // heroImages: usar do banco se for array com pelo menos 1 item
  const rawHeroImages = data.hero_images
  const heroImages = Array.isArray(rawHeroImages) && rawHeroImages.filter(Boolean).length > 0
    ? rawHeroImages.filter(Boolean)
    : DEFAULT.heroImages

  return {
    heroImages,
    heroBannerUrl: heroImages[0] || DEFAULT.heroBannerUrl,
    heroTitle:     has(data.hero_title)    ? data.hero_title    : DEFAULT.heroTitle,
    heroSubtitle:  has(data.hero_subtitle) ? data.hero_subtitle : DEFAULT.heroSubtitle,
    heroLabel:     has(data.hero_label)    ? data.hero_label    : DEFAULT.heroLabel,
    featuredIds:   Array.isArray(data.featured_ids) ? data.featured_ids : DEFAULT.featuredIds,
    banner1:       mergeBanner(data.banner1, DEFAULT.banner1),
    banner2:       mergeBanner(data.banner2, DEFAULT.banner2),
    categoryImages:     mergeCategoryImages(data.categories || data.category_images, DEFAULT.categoryImages),
    allCategoriesImage: has(data.all_categories_image) ? data.all_categories_image : DEFAULT.allCategoriesImage,
    whatsappLink:  has(data.whatsapp_link)  ? data.whatsapp_link  : DEFAULT.whatsappLink,
    instagramLink: has(data.instagram_link) ? data.instagram_link : DEFAULT.instagramLink,
    tiktokLink:    has(data.tiktok_link)    ? data.tiktok_link    : DEFAULT.tiktokLink,
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
        hero_images:     next.heroImages,
        hero_banner_url: next.heroImages?.[0] || next.heroBannerUrl,
        hero_title:      next.heroTitle,
        hero_subtitle:   next.heroSubtitle,
        hero_label:      next.heroLabel,
        featured_ids:    next.featuredIds,
        banner1:         next.banner1,
        banner2:         next.banner2,
        categories:      Object.fromEntries(
          Object.entries(next.categoryImages).map(([k, v]) => [k, { imageUrl: v }])
        ),
        all_categories_image: next.allCategoriesImage,
        whatsapp_link:   next.whatsappLink,
        instagram_link:  next.instagramLink,
        tiktok_link:     next.tiktokLink,
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
