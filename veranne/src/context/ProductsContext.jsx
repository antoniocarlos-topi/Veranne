// src/context/ProductsContext.jsx
import React, {
  createContext, useContext,
  useState, useEffect, useCallback, useRef
} from 'react'
import {
  fetchProducts,
  insertProduct,
  updateProductById,
  deleteProductById,
} from '../services/supabase'
import { products as INITIAL_PRODUCTS } from '../data/products'

const ProductsContext = createContext(null)

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const seedAttempted = useRef(false) // evitar loop infinito de seed

  // Carregar produtos do Supabase ao iniciar
  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await fetchProducts()
      if (data && data.length > 0) {
        setProducts(data.map(normalizeProduct))
      } else if (!seedAttempted.current) {
        // Supabase vazio: tentar popular UMA VEZ, se falhar usa local
        seedAttempted.current = true
        await seedInitialProducts()
      } else {
        // Seed já foi tentado — usar dados locais
        console.log('[VERANNE] Usando produtos locais (fallback)')
        setProducts(INITIAL_PRODUCTS)
      }
    } catch (err) {
      console.warn('[VERANNE] Erro ao carregar produtos:', err.message)
      setError(err.message)
      // Fallback: usar dados locais — SEMPRE funciona
      setProducts(INITIAL_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  // Popular Supabase com produtos iniciais se estiver vazio
  async function seedInitialProducts() {
    try {
      for (const p of INITIAL_PRODUCTS) {
        await insertProduct(p).catch((err) => console.warn('Erro ao inserir:', err))
      }
      const data = await fetchProducts()
      if (data && data.length > 0) {
        setProducts(data.map(normalizeProduct))
      } else {
        setProducts(INITIAL_PRODUCTS)
      }
    } catch (err) {
      console.warn('[VERANNE] Seed falhou (RLS?), usando dados locais:', err.message)
      setProducts(INITIAL_PRODUCTS)
    }
  }

  // Normalizar produto do Supabase para o formato do app
  function normalizeProduct(p) {
    return {
      id:            p.id,
      slug:          p.slug,
      name:          p.name,
      category:      p.category,
      price:         Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : null,
      installments:  p.installments || 1,
      description:   p.description,
      material:      p.material,
      sizes:         p.sizes || [],
      colors:        p.colors || [],
      images:        p.images || [],
      featured:      p.featured || false,
      isNew:         p.is_new || false,
      inStock:       p.in_stock !== false,
      tags:          p.tags || [],
      rating:        Number(p.rating) || 0,
      reviewCount:   p.review_count || 0,
      createdAt:     p.created_at,
    }
  }

  // ── ADMIN: operações de escrita ────────────────────────

  const addProduct = useCallback(async (formData) => {
    let slug = generateSlug(formData.name)
    // Garantir que o slug seja único
    if (products.some(p => p.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`
    }
    const newProductData = {
      id:            `prod_${Date.now()}`,
      slug,
      name:          formData.name,
      category:      formData.category,
      price:         Number(formData.price),
      original_price: formData.originalPrice
        ? Number(formData.originalPrice) : null,
      installments:  Number(formData.installments) || 1,
      description:   formData.description || '',
      material:      formData.material || '',
      sizes:         formData.sizes || [],
      colors:        formData.colors || [],
      images:        formData.images || [],
      featured:      formData.featured || false,
      is_new:        formData.isNew !== false,
      in_stock:      formData.inStock !== false,
      tags:          formData.tags || [],
      rating:        0,
      review_count:  0,
    }

    try {
      const saved = await insertProduct(newProductData)
      if (saved) {
        const normalized = normalizeProduct(saved)
        setProducts(prev => [normalized, ...prev])
        return normalized
      }
    } catch (err) {
      console.warn('[VERANNE] Erro ao inserir no Supabase:', err.message)
    }

    // Fallback: salvar localmente se Supabase falhar
    const localProduct = {
      id:    `local_${Date.now()}`,
      slug,
      ...formData,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    }
    setProducts(prev => [localProduct, ...prev])
    return localProduct
  }, [])

  const updateProduct = useCallback(async (id, formData) => {
    try {
      const updated = await updateProductById(id, formData)
      if (updated) {
        const normalized = normalizeProduct(updated)
        setProducts(prev =>
          prev.map(p => p.id === id ? normalized : p)
        )
        return normalized
      }
    } catch (err) {
      console.warn('[VERANNE] Erro ao atualizar no Supabase:', err.message)
    }

    // Fallback local
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, ...formData } : p)
    )
  }, [])

  const deleteProduct = useCallback(async (id) => {
    try {
      await deleteProductById(id)
    } catch (err) {
      console.warn('[VERANNE] Erro ao deletar no Supabase:', err.message)
    }
    // Sempre remover do estado local
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  const toggleFeatured = useCallback(async (id) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    try {
      await updateProductById(id, { featured: !product.featured })
    } catch (err) {
      console.warn('[VERANNE] Erro toggle destaque:', err.message)
    }
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, featured: !p.featured } : p
      )
    )
  }, [products])

  const toggleStock = useCallback(async (id) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    try {
      await updateProductById(id, { in_stock: !product.inStock })
    } catch (err) {
      console.warn('[VERANNE] Erro toggle estoque:', err.message)
    }
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, inStock: !p.inStock } : p
      )
    )
  }, [products])

  const applyPromotion = useCallback(async (id, promoPrice) => {
    const product = products.find(p => p.id === id)
    if (!product) return
    try {
      await updateProductById(id, {
        original_price: product.price,
        price: Number(promoPrice),
      })
    } catch (err) {
      console.warn('[VERANNE] Erro ao aplicar promoção:', err.message)
    }
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p,
              originalPrice: p.price,
              price: Number(promoPrice) }
          : p
      )
    )
  }, [products])

  const removePromotion = useCallback(async (id) => {
    const product = products.find(p => p.id === id)
    if (!product || !product.originalPrice) return
    try {
      await updateProductById(id, {
        price: product.originalPrice,
        original_price: null,
      })
    } catch (err) {
      console.warn('[VERANNE] Erro ao remover promoção:', err.message)
    }
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p,
              price: p.originalPrice,
              originalPrice: null }
          : p
      )
    )
  }, [products])

  // ── SITE: funções de leitura ───────────────────────────

  const getAll = useCallback(() => products, [products])

  const getBySlug = useCallback((slug) =>
    products.find(p => p.slug === slug) || null,
    [products]
  )

  const getByCategory = useCallback((category) => {
    if (!category || category.toLowerCase() === 'todos') return products
    return products.filter(p => p.category?.toLowerCase() === category.toLowerCase())
  }, [products])

  const getFeatured = useCallback(() =>
    products.filter(p => p.featured && p.inStock),
    [products]
  )

  const getNew = useCallback(() =>
    products.filter(p => p.isNew && p.inStock),
    [products]
  )

  const getRelated = useCallback((product, limit = 4) =>
    products
      .filter(p =>
        p.category === product.category &&
        p.id !== product.id &&
        p.inStock
      )
      .slice(0, limit),
    [products]
  )

  const search = useCallback((query) => {
    if (!query || query.trim().length < 2) return []
    const q = query.toLowerCase().trim()
    return products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q)
    )
  }, [products])

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      error,
      loadProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleFeatured,
      toggleStock,
      applyPromotion,
      removePromotion,
      getAll,
      getBySlug,
      getByCategory,
      getFeatured,
      getNew,
      getRelated,
      search,
      getAllProducts: getAll,
      getProductBySlug: getBySlug,
      getProductsByCategory: getByCategory,
      getFeaturedProducts: getFeatured,
      getNewProducts: getNew,
      getRelatedProducts: getRelated,
      searchProducts: search,
    }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProductsContext() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error(
    'useProductsContext fora de ProductsProvider'
  )
  return ctx
}
