// src/context/CouponsContext.jsx
import React, {
  createContext, useContext,
  useState, useEffect, useCallback
} from 'react'
import {
  fetchCoupons,
  insertCoupon,
  updateCouponById,
  deleteCouponById
} from '../services/supabase'

const CouponsContext = createContext(null)

export function CouponsProvider({ children }) {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoupons()
  }, [])

  async function loadCoupons() {
    try {
      const data = await fetchCoupons()
      setCoupons(data || [])
    } catch (err) {
      console.error('[VERANNE] Erro ao carregar cupons:', err)
      setCoupons([])
    } finally {
      setLoading(false)
    }
  }

  const addCoupon = useCallback(async (data) => {
    const coupon = {
      id:          `coup_${Date.now()}`,
      code:        data.code.toUpperCase().trim(),
      type:        data.type,        // 'percent' ou 'fixed'
      value:       Number(data.value),
      min_order:   Number(data.minOrder || data.min_order || 0),
      usage_limit: data.usageLimit  || data.usage_limit  || null,
      usage_count: 0,
      expires_at:  data.expiresAt   || data.expires_at   || null,
      active:      true,
    }
    const saved = await insertCoupon(coupon)
    if (saved) {
      setCoupons(prev => [saved, ...prev])
      return saved
    }
    throw new Error('Falha ao salvar o cupom. Nenhuma resposta do servidor.')
  }, [])

  const updateCoupon = useCallback(async (id, updates) => {
    // Normalizar chaves para snake_case se vierem como camelCase
    const payload = { ...updates }
    if ('minOrder' in payload) {
      payload.min_order = payload.minOrder
      delete payload.minOrder
    }
    const saved = await updateCouponById(id, payload)
    setCoupons(prev => prev.map(c => c.id === id ? saved : c))
  }, [])

  const deleteCoupon = useCallback(async (id) => {
    await deleteCouponById(id)
    setCoupons(prev => prev.filter(c => c.id !== id))
  }, [])

  const toggleCoupon = useCallback(async (id) => {
    const coupon = coupons.find(c => c.id === id)
    if (!coupon) return
    const saved = await updateCouponById(id, { active: !coupon.active })
    setCoupons(prev => prev.map(c => c.id === id ? saved : c))
  }, [coupons])

  // Uso no carrinho
  const validateCoupon = useCallback((code, orderTotal) => {
    if (!code) return { valid: false, message: 'Código vazio' }
    const coupon = coupons.find(x => x.code === code.toUpperCase() && x.active)

    if (!coupon) return { valid: false, message: 'Cupom inválido ou inativo.' }

    if (coupon.expires_at && 
        new Date(coupon.expires_at) < new Date()) {
      return { valid: false, message: 'Cupom expirado.' }
    }
    if (coupon.usage_limit !== null && 
        coupon.usage_count >= coupon.usage_limit) {
      return { valid: false, message: 'Limite de uso atingido.' }
    }
    if (coupon.min_order > 0 && 
        orderTotal < coupon.min_order) {
      return { 
        valid: false, 
        message: `Pedido mínimo de R$ ${Number(coupon.min_order)
          .toFixed(2).replace('.', ',')} para este cupom.` 
      }
    }

    const discount = coupon.type === 'percent'
      ? orderTotal * (coupon.value / 100)
      : Math.min(coupon.value, orderTotal)

    // O retorno usa camelCase para compatibilidade com a UI atual
    return {
      valid: true,
      discount,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.min_order
      }
    }
  }, [coupons])

  // Aumenta usage_count
  const useCoupon = useCallback(async (id) => {
    const coupon = coupons.find(c => c.id === id)
    if (!coupon) return
    const nextCount = (coupon.usage_count || 0) + 1
    await updateCouponById(id, { usage_count: nextCount })
    // Recarregar em background ou atualizar localmente
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, usage_count: nextCount } : c))
  }, [coupons])

  return (
    <CouponsContext.Provider value={{
      coupons, loading,
      addCoupon, updateCoupon,
      deleteCoupon, toggleCoupon,
      validateCoupon, useCoupon, loadCoupons,
    }}>
      {children}
    </CouponsContext.Provider>
  )
}

export function useCoupons() {
  const ctx = useContext(CouponsContext)
  if (!ctx) throw new Error('useCoupons fora de CouponsProvider')
  return ctx
}
