// src/context/ConfigContext.jsx
import React, {
  createContext, useContext,
  useState, useEffect, useCallback
} from 'react'
import { fetchSettings, upsertSettings } from '../services/supabase'
import { CONFIG as DEFAULTS } from '../config'

function normalize(data) {
  if (!data) return DEFAULTS
  return {
    whatsappNumber:    data.whatsapp_number     || DEFAULTS.whatsappNumber,
    storeEmail:        data.store_email         || DEFAULTS.storeEmail,
    instagram:         data.instagram           || DEFAULTS.instagram,
    tiktok:            data.tiktok              || DEFAULTS.tiktok,
    freeShippingAbove: Number(data.free_shipping_above)
      || DEFAULTS.freeShippingAbove,
  }
}

const ConfigContext = createContext(null)

export function ConfigProvider({ children }) {
  const [config,  setConfig]  = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [])

  async function loadConfig() {
    try {
      const data = await fetchSettings()
      setConfig(normalize(data))
    } catch {
      setConfig(DEFAULTS)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = useCallback(async (updates) => {
    const next = { ...config, ...updates }
    setConfig(next)
    try {
      await upsertSettings({
        whatsapp_number:     next.whatsappNumber,
        store_email:         next.storeEmail,
        instagram:           next.instagram,
        tiktok:              next.tiktok,
        free_shipping_above: next.freeShippingAbove,
      })
    } catch (err) {
      console.error('[VERANNE] Erro ao salvar config:', err)
      throw err
    }
  }, [config])

  return (
    <ConfigContext.Provider value={{ config, loading, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig fora de ConfigProvider')
  return ctx
}
