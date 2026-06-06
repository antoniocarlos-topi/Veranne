import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Atualiza visibilidade sempre que muda
        // true quando entra na tela, false quando sai
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: options.threshold || 0.12,
        rootMargin: options.rootMargin || '0px 0px -40px 0px',
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}
