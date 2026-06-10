// src/services/supabase.js
// ============================================================
// VERANNE — Cliente Supabase (resiliente)
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[VERANNE] Credenciais Supabase não encontradas no .env')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  // Evitar erros 406 — aceitar retorno vazio sem erro
  global: {
    headers: {
      'Prefer': 'return=representation'
    }
  }
})

// ── AUTH ──────────────────────────────────────────────────

export async function signUp(email, password, name) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/nova-senha`
  })
  if (error) throw error
}

// ── PRODUTOS ─────────────────────────────────────────────

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ── UTILS ────────────────────────────────────────────────

// Converte um objeto com chaves camelCase para snake_case
function toSnakeCase(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj
  const result = {}
  for (const key of Object.keys(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = obj[key]
  }
  return result
}

// Converte um objeto com chaves snake_case para camelCase
function toCamelCase(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj
  const result = {}
  for (const key of Object.keys(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = obj[key]
  }
  return result
}

// ── PRODUTOS ─────────────────────────────────────────────

export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function insertProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .upsert([toSnakeCase(product)], { 
      onConflict: 'slug',
      ignoreDuplicates: true 
    })
    .select()
    .single()
  
  // Ignorar erro de duplicata silenciosamente
  if (error && error.code === '23505') return product
  if (error) throw error
  return toCamelCase(data)
}

export async function updateProductById(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...toSnakeCase(updates), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function deleteProductById(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── HOMEPAGE ─────────────────────────────────────────────

export async function fetchHomepageConfig() {
  const { data, error } = await supabase
    .from('homepage_config')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  // Não lançar erro se a tabela não existir ou estiver vazia
  if (error) {
    console.warn('[VERANNE] homepage_config:', error.message)
    return null
  }
  return data
}

export async function upsertHomepageConfig(config) {
  const { data, error } = await supabase
    .from('homepage_config')
    .upsert({ id: 1, ...config, updated_at: new Date().toISOString() })
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

// ── CONFIGURAÇÕES ─────────────────────────────────────────

export async function fetchSettings() {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  // Não lançar erro se a tabela não existir ou estiver vazia
  if (error) {
    console.warn('[VERANNE] store_settings:', error.message)
    return null
  }
  return data
}

export async function upsertSettings(settings) {
  const { data, error } = await supabase
    .from('store_settings')
    .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() })
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

// ── CUPONS ───────────────────────────────────────────────

export async function fetchCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[VERANNE] coupons:', error.message)
    return []
  }
  return data || []
}

export async function insertCoupon(coupon) {
  const { data, error } = await supabase
    .from('coupons')
    .insert([coupon])
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function updateCouponById(id, updates) {
  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function deleteCouponById(id) {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── FAVORITOS ────────────────────────────────────────────

export async function fetchFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId)
  if (error) {
    console.warn('[VERANNE] favorites:', error.message)
    return []
  }
  return (data || []).map(f => f.product_id)
}

export async function addFavorite(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, product_id: productId }])
  if (error && error.code !== '23505') throw error
}

export async function removeFavorite(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId)
  if (error) throw error
}

// ── STORAGE — Upload de imagens ───────────────────────────

// Upload de imagem de banner
export async function uploadBannerImage(file, bannerType) {
  // bannerType: 'hero', 'banner1', 'banner2', 'categories'
  const ext      = file.name.split('.').pop().toLowerCase()
  const allowed  = ['jpg', 'jpeg', 'png', 'webp']

  if (!allowed.includes(ext)) {
    throw new Error('Formato não suportado. Use JPG, PNG ou WebP.')
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Imagem deve ter no máximo 10MB.')
  }

  const filename = `banners/${bannerType}/${Date.now()}_${Math.random()
    .toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('veranne-images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from('veranne-images')
    .getPublicUrl(filename)

  return data.publicUrl
}

export async function uploadImage(file, folder = 'products') {
  const ext      = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}_${Math.random()
    .toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from('veranne-images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from('veranne-images')
    .getPublicUrl(filename)

  return data.publicUrl
}

export async function deleteImage(url) {
  const path = url.split('/veranne-images/')[1]
  if (!path) return

  const { error } = await supabase.storage
    .from('veranne-images')
    .remove([path])

  if (error) throw error
}

// ── PEDIDOS ──────────────────────────────────────────────

export async function insertOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}

export async function fetchOrdersByUser(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.warn('[VERANNE] orders:', error.message)
    return []
  }
  return data || []
}

// ── PERFIL ───────────────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    console.warn('[VERANNE] profile:', error.message)
    return null
  }
  return data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .maybeSingle()
  if (error) throw error
  return data
}
