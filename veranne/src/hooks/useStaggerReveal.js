import { useEffect, useRef, useState } from 'react'

export function useStaggerReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: options.threshold || 0.08,
        rootMargin: options.rootMargin || '0px 0px -40px 0px',
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}
