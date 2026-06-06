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

  const addCoupon = useCallback(async (code, type, value, minOrder) => {
    const newCoupon = {
      code: code.toUpperCase(),
      type, // 'percent' | 'fixed'
      value: Number(value),
      min_order: Number(minOrder) || 0,
      active: true,
      usage_count: 0
    }
    const saved = await insertCoupon(newCoupon)
    setCoupons(prev => [saved, ...prev])
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
    const c = coupons.find(x => x.code === code.toUpperCase() && x.active)

    if (!c) return { valid: false, message: 'Cupom inválido ou expirado' }
    if (orderTotal < c.min_order) {
      return {
        valid: false,
        message: `Pedido mínimo de R$ ${c.min_order.toFixed(2)}`
      }
    }

    const discount = c.type === 'percent'
      ? orderTotal * (c.value / 100)
      : Math.min(c.value, orderTotal)

    // O retorno usa camelCase para compatibilidade com a UI atual
    return {
      valid: true,
      discount,
      coupon: {
        id: c.id,
        code: c.code,
        type: c.type,
        value: c.value,
        minOrder: c.min_order
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
