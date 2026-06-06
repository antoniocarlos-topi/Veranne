// ============================================================
// VERANNE — Inicialização do localStorage
//
// Garante que o localStorage tenha dados válidos
// antes do React renderizar qualquer componente.
// ============================================================

import { products as INITIAL_PRODUCTS } from '../data/products.js'

const PRODUCTS_KEY = 'veranne_products'

export function initStorage() {
  try {
    const existing = localStorage.getItem(PRODUCTS_KEY)

    if (!existing) {
      // Primeira visita: popular com produtos iniciais
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS))
      console.log(
        '[VERANNE] localStorage inicializado com',
        INITIAL_PRODUCTS.length,
        'produtos'
      )
      return
    }

    const parsed = JSON.parse(existing)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS))
      console.log('[VERANNE] localStorage resetado — dados inválidos')
    }
  } catch {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS))
    console.log('[VERANNE] localStorage resetado — erro de parse')
  }
}
