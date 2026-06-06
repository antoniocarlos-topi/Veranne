import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'veranne_cart'
const COUPON_STORAGE_KEY = 'veranne_applied_coupon'

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = safeParse(raw, [])
    if (Array.isArray(parsed)) setItems(parsed)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY)
    if (!raw) return
    const parsed = safeParse(raw, null)
    setAppliedCoupon(parsed)
  }, [])

  useEffect(() => {
    if (!appliedCoupon) {
      localStorage.removeItem(COUPON_STORAGE_KEY)
      return
    }
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon))
  }, [appliedCoupon])

  function addToCart(product, selectedSize, selectedColor) {
    setItems(prev => {
      const pid = product?.id
      if (!pid) return prev
      const idx = prev.findIndex(
        it => it.product?.id === pid && 
              it.selectedSize === selectedSize && 
              it.selectedColor?.name === selectedColor?.name
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + 1,
        }
        return next
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedSize,
          selectedColor,
        },
      ]
    })
  }

  function removeFromCart(productId, selectedSize, selectedColor) {
    setItems(prev =>
      prev.filter(it => !(it.product?.id === productId && it.selectedSize === selectedSize && it.selectedColor?.name === selectedColor?.name))
    )
  }

  function updateQuantity(productId, selectedSize, selectedColor, newQuantity) {
    setItems(prev =>
      prev
        .map(it => {
          if (it.product?.id !== productId) return it
          if (it.selectedSize !== selectedSize) return it
          if (it.selectedColor?.name !== selectedColor?.name) return it
          return { ...it, quantity: newQuantity }
        })
        .filter(it => it.quantity > 0)
    )
  }

  const totals = useMemo(() => {
    const totalItems = items.reduce((sum, it) => sum + (it.quantity || 0), 0)
    const subtotal = items.reduce((sum, it) => {
      const price = Number(it.product?.price ?? 0)
      return sum + price * (it.quantity || 0)
    }, 0)

    const discount = (() => {
      if (!appliedCoupon) return 0
      if (subtotal <= 0) return 0

      if (appliedCoupon.type === 'percent') {
        return subtotal * (appliedCoupon.value / 100)
      }

      // value fixed (R$)
      return Math.min(appliedCoupon.value, subtotal)
    })()

    const totalPrice = Math.max(0, subtotal - discount)

    return {
      totalItems,
      subtotal,
      discount,
      totalPrice,
    }
  }, [items, appliedCoupon])

  function applyCoupon(code, availableCoupons) {
    const coupon = availableCoupons?.find(
      c =>
        c.code === String(code || '').toUpperCase() &&
        c.active
    )
    if (!coupon) return { success: false, message: 'Cupom inválido ou expirado.' }

    if (coupon.minOrder && totals.subtotal < coupon.minOrder) {
      const formatted = coupon.minOrder.toFixed(2).replace('.', ',')
      return {
        success: false,
        message: `Pedido mínimo de R$ ${formatted} para este cupom.`,
      }
    }

    setAppliedCoupon(coupon)
    return { success: true, message: `Cupom ${coupon.code} aplicado!` }
  }

  function removeCoupon() {
    setAppliedCoupon(null)
  }

  function getDiscount() {
    return totals.discount || 0
  }

  function clearCart() {
    setItems([])
    setAppliedCoupon(null)
  }

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscount,
    ...totals,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
